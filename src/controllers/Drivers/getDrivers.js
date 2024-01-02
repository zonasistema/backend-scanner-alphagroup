import axios from "axios";
import Settings from "../../utils/Setting.js";

const getDrivers = async (req, res) => {
  try {
    const { url, headers } = Settings("/getdrivers");

    const infoUrl = await axios.post(url, null, { headers });

    if (!infoUrl.data.data.length)
      return res.status(400).send({ msg: "No hay registros" });

    res.send(infoUrl.data.data);
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

export default getDrivers;
