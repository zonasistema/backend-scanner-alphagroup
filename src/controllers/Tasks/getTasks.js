import axios from "axios";
import Settings from "../../utils/Setting.js";

const getTasks = async (query) => {
  try {
    // Obligatorio deliveryDueDate. taskStatusId --> Viene como un array, para poder traer todos los paquetes.
    const { deliveryStartDate, deliveryDueDate, taskStatusId } = query;
    const { url, headers } = Settings("/gettasks");

    let dateStart;
    let dateDue = deliveryDueDate;

    if (!dateStart || dateStart === undefined) {
      // Agarro -5 dias al actual para guardarlo en dateStart
      const currentDate = new Date(dateDue);
      currentDate.setDate(currentDate.getDate() - 3);
      dateStart = currentDate.toISOString().slice(0, 10);
    } else {
      dateStart = deliveryStartDate;
    }

    const requestData = {
      deliveryDueDate: dateDue,
      deliveryStartDate:
        deliveryStartDate === "undefined"
          ? dateStart /* + "T12:00:00.000Z" */
          : deliveryStartDate /* + "T12:00:00.000Z" */,
    };

    // Por cada tarea hago una solicitud [10,15,20]
    const tasks = await Promise.all(
      JSON.parse(taskStatusId).map(async (status) => {
        const infoUrls = await axios.post(
          url,
          { ...requestData, taskStatusId: status },
          { headers }
        );
        return infoUrls.data.data.map((task) => ({
          id: task.id,
          taskDesc: task.taskDesc,
          externalKey: task.externalKey,
          destinationAddress: task.destinationAddress,
          destinationNotes: task.destinationNotes,
          recipientName: task.recipientName,
          routeSortId: task.routeSortId,
          driverName: task.driverName,
        }));
      })
    );

    const info = tasks.flat(); // Aplanamos el array de arrays

    if (!info.length) {
      return { msg: "No hay registros" };
    }

    return info;
  } catch (error) {
    return { msg: error.message };
  }
};

export default getTasks;
