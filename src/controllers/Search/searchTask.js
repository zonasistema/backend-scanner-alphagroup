import removeAccents from "../../utils/removeAccents.js";
import getTasks from "../Tasks/getTasks.js";

const searchTask = async (req, res) => {
  try {
    // tengo que pasarle las query a getTaks ->  deliveryStartDate, deliveryDueDate, taskStatusId
    const { nameOrAddres, deliveryStartDate, deliveryDueDate, taskStatusId } =
      req.query;

    const query = {
      deliveryStartDate,
      deliveryDueDate,
      taskStatusId: JSON.stringify(["10", "15", "20"]), // Cambiar esto, mandarlo por el front
    };

    const tasks = await getTasks(query);

    const nameOrAddresWithoutAccent = removeAccents(nameOrAddres);

    let name = "";
    let address = "";

    if (nameOrAddresWithoutAccent.includes(",")) {
      // En el buscador es nombre, direccion. Separo por coma y guardo el nombre y la direccion.
      const arr = nameOrAddresWithoutAccent.split(",");
      name = arr[0];
      arr[2] ? (address = arr[1] + "" + arr[2]) : (address = arr[1]);
    } else {
      // Si no hay coma lo dejo en los 2.
      name = nameOrAddresWithoutAccent;
      address = nameOrAddresWithoutAccent;
    }

    // verifico si hay error
    if (tasks.hasOwnProperty("msg")) return res.status(400).send(tasks);

    // Busco el nombre pasando todo a minuscula, tanto en la peticion como en la busqueda.
    const includeName = tasks?.filter((data) =>
      data.recipientName.toLowerCase().includes(name.toLowerCase())
    );

    // Busco la direccion pasando todo a minuscula, tanto en la peticion como en la busqueda.
    const includeAddress = tasks?.filter((data) =>
      data.destinationAddress.toLowerCase().includes(address.toLowerCase())
    );

    // Concateno para que me retorne todo
    const includesAll = includeName.concat(includeAddress);

    if (!includesAll.length) {
      return res.status(404).send({ msg: "No se encontraron registros" });
    }

    res.send(includesAll);
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

export default searchTask;
