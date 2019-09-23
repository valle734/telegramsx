const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

let BrokerMQTT = 'mqtt://broker.shiftr.io';
let PuertoMQTT = 1883;
let ClienteIDMQTT = "ServidorFotos";
let UsuarioMQTT = "ServerX2019";
let ContrasenaMQTT = "Exporical734";
let TempeAlta = false;

let Opciones = {
  port: PuertoMQTT,
  clientId: ClienteIDMQTT,
  username: UsuarioMQTT,
  password: ContrasenaMQTT
}

var mqtt = require('mqtt');
var client = mqtt.connect(BrokerMQTT, Opciones);

client.on('connect', function() {
  client.subscribe('/SX/Camara/Alerta', function(err) {
    console.log("MQTT Activado")
  })
  client.subscribe('/SX/Sensor/Temperatura', function(err) {
    console.log("MQTT Activado")
  })
})

client.on('message', function(topic, message) {
  console.log(topic.toString() + " " + message.toString());

  let Mensaje = message.toString();
  if (topic.toString() == "/SX/Camara/Alerta") {
    var Photo = fs.readFileSync('C:/Users/jimmy/Downloads/' + Mensaje);
    //Photo = 'https://comefruta.es/wp-content/uploads/manzana-de-temporada-800x533.jpg'
    console.log("Mandando Foto");
    bot.sendPhoto(IdMiChat, Photo);
  } else if (topic.toString() == "/SX/Sensor/Temperatura") {
    let tmp = parseFloat(message.toString());
    if (tmp >= 30 && !TempeAlta) {
      bot.sendMessage(IdMiChat, 'Alerta:temperatura alta');
      TempeAlta = true;
    } else if (tmp < 30 && TempeAlta) {
      bot.sendMessage(IdMiChat, 'Temperatura estable');
      TempeAlta = false;
    }
    else {
      TempeAlta = false;
    }
  }
})

const token = '758620201:AAFLP0DE9-sEiKrDtbUeZo90j7rVJH6BkmI'; //Cambiar por el token de telegram
const bot = new TelegramBot(token, {
  polling: true
});
var IdMiChat = 847479960; //cambiar por tu ID del chat

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log("El ID del char" + chatId);
  var Mensaje = msg.text;
  if (Mensaje == "Encender") {
    console.log("encendiendo el led");
    bot.sendMessage(chatId, 'Encendere el led');

  } else if (Mensaje == "Apagar") {
    console.log("apagar el led");
    bot.sendMessage(chatId, 'Apagare el led');

  } else if (Mensaje == "Foto") {
    var Photo = fs.readFileSync('C:/Users/jimmy/Downloads/myCanvas.jpg');

    //Photo = 'https://comefruta.es/wp-content/uploads/manzana-de-temporada-800x533.jpg'
    console.log("Mandando Foto");
    bot.sendPhoto(chatId, Photo);
  }
});
