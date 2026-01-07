import dotenv from "dotenv";

dotenv.config();

const { SECRET_KEY } = process.env;

//Configuracion para la peticion a woodelivery
const Settings = (url) => {
  return {
    // crossDomain: true,s
    url: `https://api.wodely.com/api/form${url}`,
    headers: {
      Authorization: SECRET_KEY,
    },
    // processData: false,
  };
};

export default Settings;
// url: `https://api.wodely.com/swagger/v1/swagger.json/#/components/schemas/GetTasksRequest`,
