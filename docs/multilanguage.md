# Documentación del sistema multilenguaje
El sistema multilenguaje tiene como objetivo la traducción automática para el bot, solo escribiendo la traducción, sin perder tiempo crear código innecesario
## Empezando
Es necesario añadir una nueva propiedad al `slashcommand`cuando se exporta, la cual debe de llamarse `languageKeys` y como valor debe de tener un `array` con `strings`, en esta nueva propiedad se pondrá un listado de las llaves (keys) de la palabra a la cual quieres acceder. Ejemplo:

    module.exports = {
	    data: new SlashCommandBuilder(),
	    run: async() => {},
	    languageKeys: ['KEY', 'OTHER_KEY']
	}

Además, la función `run` recibirá un nuevo parámetro, el cual se llamará `language`, este parámetro tendrá un `array` de `strings`, cuyos valores serán los valores de las llaves pasadas en la propiedad `languageKeys`
## Archivos `.csv`
Los archivos con la extensión `.csv` son los encargados de tener toda la traducción del bot. Para tener un mayor orden dentro del código del bot, se creó la carpeta `language`, en la cual encontrarás todos los archivos `.csv`o crear nuevos archivos `.csv`. Si no sabes que es un archivo csv, puedes acceder [aquí](https://www.geeknetic.es/Archivo-CSV/que-es-y-para-que-sirve) para informarte.

### ¿Como añado llaves y valores?
Para esto se ha creado la carpeta `language` el cual tiene archivos con la extensión `.csv`, en estos archivos podrás escribir las llaves en la primera columna y los valores en la demás. Los archivos se ven algo tal que así:
![enter image description here](https://media.discordapp.net/attachments/853165610347135006/1025111319915003986/unknown.png?width=1025&height=404)
Te recomiendo ampliamente descargarte las siguientes extensiones de visual studio code:

 - **Rainbow csv**
 - **Edit csv**
 
  La primera extensión sirve para separar por colores las columnas, para su fácil edición de manera manual:
  ![Rainbow csv](https://media.discordapp.net/attachments/853165610347135006/1025110981338206289/unknown.png?width=1025&height=404)

  Y la segunda sirve para poder editar el archivo directamente como tabla:
  ![Edit csv](https://media.discordapp.net/attachments/853165610347135006/1025113890872381440/unknown.png?width=1025&height=291)

Al tratarse de tablas las cuales están separadas por comas `,` estas no se pueden poner en el valor o las llaves, por lo cual, todas las comas deben de ser sustituidas por `&44`, automáticamente el sistema multilenguaje las convertirá en `,` para que no exista problema alguno con lo que ve el usuario final.

### ¿Qué idiomas soporta?
El sistema multilenguaje soporta todos los [idiomas soportados por discord](https://discord.com/developers/docs/reference#locales). Para escribir un nuevo idioma que no se encuentre entre los archivos, solo se necesita añadir una nueva columna con la abreviación del  `locale`.

### Texto random
Esta sección se creó para cuando una llave pueda tener multiples valores, para esto el texto debe de estar separado por `|`, para así separar las frases que tiene el valor, automáticamente se seleccionará una, todo esto con el fin de tener un mayor rendimiento. Ejemplo de uso:
![Random separador](https://media.discordapp.net/attachments/853165610347135006/1025118758840320080/unknown.png?width=1025&height=34)
En este ejemplo vemos la llave y dos valores, cada valor tiene varios `|`, los cuales son separadores. En este caso si se detecta algún `|` usará el método `split` para separarlo y generar un array, el cual finalmente ejecutará un Math.random() para solo dar un valor.

### Caracteres prohibidos

Existen dos caracteres los cuales, si bien, no están prohibidos del todo, es necesario que sean usados solo el situaciones puntuales:
| Carácter | ¿Por qué está prohibido? | Sustituto |
|--|--|--|
| `,` | Este carácter sirve para separar columnas dentro de los archivos .csv, por lo cual al usar esto para cumplir la reglas gramaticales del idioma crearías una columna nueva | `&44` |
| `|` | Este carácter es usado para delimitar posibles valores y sacar un valor aleatorio, por lo cual puede generar un conflicto y mostrar frases cortadas | `&124` |

### Estandarización

Se planea tener un estándar para tener una mejor legibilidad del código. Para ello es necesario seguir con lo siguiente

 - **Usar `{ }`para un valor variable y luego sustituirlo usando un `.replace`**
 
	Esta regla consiste en usar las llaves para poner una palabra referente a lo que se va a sustituir, esta debe de ser igual en todos los idiomas, para así poder aplicar un `replace` y sustituir el valor.
	
	Ejemplo de como se pondría en el archivo .csv:
	![Variables en csv](https://media.discordapp.net/attachments/853165610347135006/1025123982493634640/unknown.png)
	
	Ejemplo de como se sustituye la variable:
	![Editando variables en el código](https://media.discordapp.net/attachments/853165610347135006/1025124921053036586/unknown.png)
	
- **Utilizar `Capitalized Snake Case` para el nombre de las llaves**

## ¿Cómo traduzco el texto en los slashcommands?
Cuando pulsas en el teclado `/` te salen los slashcommands... pero queremos traducir todo, ¿Cómo traduzco eso? Para eso existen los métodos [`.setNameLocalization()`](https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder?scrollTo=setNameLocalization) y [`.setDescriptionLocalization()`](https://discord.js.org/#/docs/builders/main/class/SlashCommandBuilder?scrollTo=setDescriptionLocalization)
