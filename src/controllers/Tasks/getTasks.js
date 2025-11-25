import axios from "axios";
import Settings from "../../utils/Setting.js";

const getTasks = async (query) => {
  try {
    const { deliveryStartDate, deliveryDueDate, taskStatusId } = query;
    const { url, headers } = Settings("/gettasks");

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
      deliveryDueDate: dateDue.toISOString(), // Convertir de nuevo a cadena ISO 8601
      deliveryStartDate: dateStart,
    };

    const tasks = await Promise.all(
      JSON.parse(taskStatusId).map(async (status) => {
        const infoUrls = await axios.post(
          url,
          { ...requestData, taskStatusId: status },
          { headers }
        );
        const statusResults = infoUrls.data.data;
        console.log("Woodelivery gettasks per status", {
          status,
          deliveryStartDate: dateStart,
          deliveryDueDate: dateDue.toISOString(),
          count: statusResults.length,
        });

        return statusResults.map((task) => ({
          id: task.id,
          taskDesc: task.taskDesc,
          externalKey: task.externalKey,
          destinationAddress: task.destinationAddress,
          destinationNotes: task.destinationNotes,
          recipientName: task.recipientName,
          routeSortId: task.routeSortId,
          driverName: task.driverName,
          datestart: dateStart,
          dateDue: dateDue.toISOString(), // Convertir de nuevo a cadena ISO 8601
        }));
      })
    );

    const info = tasks.flat(); // Aplanar el array de arrays

    console.log("Woodelivery gettasks aggregated", {
      statusIds: JSON.parse(taskStatusId),
      deliveryStartDate: dateStart,
      deliveryDueDate: dateDue.toISOString(),
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
