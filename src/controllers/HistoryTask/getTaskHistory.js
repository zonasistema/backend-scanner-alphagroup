import axios from "axios";
import Settings from "../../utils/Setting.js";

const getTaskHistory = async (req, res) => {
  try {
    const { historyId } = req.params;
    const { url, headers } = Settings("/gettaskhistory");

    const info = await axios.post(url, { taskGuid: historyId }, { headers });

    if (!info.data.data.length)
      return res.status(400).send({ msg: "No hay resultados" });

    res.send(info.data.data);
  } catch (error) {
    console.log("soy error: ", error);
    res.status(400).send({ msg: error.message });
  }
};

export default getTaskHistory;
