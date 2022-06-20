**FORMA DE TRABAJAR EL MULTILENGUAJE:**

PASO 1:

Para añadir un nuevo texto necesitas ir al archivo language.csv en el cuál será muy parecido a una tabla, solo que separaras las columnas por ",", por ende no puedes poner comas, para ponerlas utiliza "&44"

PASO 2:

Utiliza el método _.setNameLocalization_ y _.setDescriptionLocalization_ para establecer el nombre y la descripción de los comandos, subcomandos y opciones

```
new SlashCommand()
.setName(`ping`)
.setDescription(`Comando ping`)
.setDescriptionLocalization(`Ping command`)
```

PASO 3:

Para obtener el lenguaje solo llama a la función getLanguage, esta función requiere el cliente, la interacción y string, los cuáles son las keys para obtener algún texto, esta funcion retorna un array con los textos en el lenguaje del usuario que ha usado el comando

```
const getLanguage = require(`../../functions/getLanguage`)
const language = getLanguage(client, interaction, `text`)

interaction.reply(language[0])
```
