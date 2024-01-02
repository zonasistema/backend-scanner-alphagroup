import axios from "axios";
import Settings from "../../utils/Setting.js";

const getTaskId = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { url, headers } = Settings("/gettask");

    // url -->"https://api.woodelivery.com/api/form/gettask",
    // headers --> { headers: { Authorization: process.env.SECRET_KEY } }
    const info = await axios.post(url, { taskGuid: taskId }, { headers });

    res.send(info.data.data);
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

export default getTaskId;
