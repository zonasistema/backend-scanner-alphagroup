import axios from "axios";

const getTasks = async (query) => {
  try {
    const { deliveryStartDate, deliveryDueDate, taskStatusId } = query;
    const WOODELIVERY_URL =
      process.env.WOODELIVERY_TASK_SEARCH_URL ||
      "https://api.woodelivery.com/v2/tasks/search";
    const API_KEY =
      process.env.WOODELIVERY_API_KEY || process.env.SECRET_KEY || "";

    const normalizeStatusIds = (raw) => {
      if (Array.isArray(raw)) return raw;
      if (typeof raw === "string") {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
          if (parsed) return [parsed];
        } catch (err) {
          if (raw.includes(",")) return raw.split(",").map((s) => s.trim());
          return raw ? [raw] : [];
        }
      }
      return [];
    };

    const statusIds = normalizeStatusIds(taskStatusId);

    let dateStartObj;
    let dateDue = new Date(deliveryDueDate); // Convertir la cadena de fecha a un objeto Date

    // Sumar un día a la fecha deliveryDueDate
    dateDue.setDate(dateDue.getDate() + 1);

    if (!deliveryStartDate || deliveryStartDate === "undefined") {
      // Agarrar -5 días al actual para guardar en dateStart
      const currentDate = new Date(dateDue);
      currentDate.setDate(currentDate.getDate() - 5);
      dateStartObj = currentDate;
    } else {
      dateStartObj = new Date(deliveryStartDate);
    }

    const startISO = dateStartObj.toISOString();
    const endISO = dateDue.toISOString(); // Convertir de nuevo a cadena ISO 8601

    const requestData = {
      startDateTime: startISO,
      endDateTime: endISO,
    };

    const tasks = await Promise.all(
      statusIds.map(async (status) => {
        const payload = { ...requestData, taskStatusId: status };

        console.log("Woodelivery v2 search payload", {
          url: WOODELIVERY_URL,
          ...payload,
        });

        const infoUrls = await axios.post(WOODELIVERY_URL, payload, {
          headers: {
            Accept: "application/json",
            Authorization: API_KEY,
            "Content-Type": "application/json",
          },
        });

        const statusResults = infoUrls.data?.data || [];
        console.log("Woodelivery v2 search per status", {
          status,
          startDateTime: payload.startDateTime,
          endDateTime: payload.endDateTime,
          count: statusResults.length,
          success: infoUrls.data?.success,
          message: infoUrls.data?.message,
        });

        return statusResults.map((task) => ({
          id: task.id,
          guid: task.guid,
          taskDesc: task.taskDesc,
          externalKey: task.externalKey,
          destinationAddress: task.destinationAddress,
          destinationNotes: task.destinationNotes,
          recipientName: task.recipientName,
          routeSortId: task.routeSortId,
          driverName: task.driverName,
          datestart: startISO,
          dateDue: endISO,
        }));
      })
    );

    const info = tasks.flat(); // Aplanar el array de arrays

    console.log("Woodelivery v2 search aggregated", {
      statusIds,
      startDateTime: startISO,
      endDateTime: endISO,
      count: info.length,
    });

    if (!info.length) {
      return { msg: "No hay registros" };
    }

    return info;
  } catch (error) {
    return { msg: error.message };
  }
};

export default getTasks;
