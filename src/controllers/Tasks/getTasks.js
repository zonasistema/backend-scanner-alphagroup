import axios from "axios";

const getTasks = async (query) => {
  try {
    const { deliveryStartDate, deliveryDueDate, taskStatusId } = query;
    const WOODELIVERY_URL =
      process.env.WOODELIVERY_TASK_SEARCH_URL ||
      "https://api.woodelivery.com/v2/tasks/search";
    const API_KEY =
      process.env.WOODELIVERY_API_KEY || process.env.SECRET_KEY || "";

    let dateStart;
    let dateDue = new Date(deliveryDueDate); // Convertir la cadena de fecha a un objeto Date

    // Sumar un día a la fecha deliveryDueDate
    dateDue.setDate(dateDue.getDate() + 1);

    if (!deliveryStartDate || deliveryStartDate === "undefined") {
      // Agarrar -5 días al actual para guardar en dateStart
      const currentDate = new Date(dateDue);
      currentDate.setDate(currentDate.getDate() - 5);
      dateStart = currentDate.toISOString().slice(0, 10);
    } else {
      dateStart = deliveryStartDate;
    }

    const requestData = {
      startDateTime: dateStart,
      endDateTime: dateDue.toISOString(), // Convertir de nuevo a cadena ISO 8601
    };

    const tasks = await Promise.all(
      JSON.parse(taskStatusId).map(async (status) => {
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
          datestart: dateStart,
          dateDue: dateDue.toISOString(),
        }));
      })
    );

    const info = tasks.flat(); // Aplanar el array de arrays

    console.log("Woodelivery v2 search aggregated", {
      statusIds: JSON.parse(taskStatusId),
      startDateTime: dateStart,
      endDateTime: dateDue.toISOString(),
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
