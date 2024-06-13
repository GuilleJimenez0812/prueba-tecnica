
# Prueba técnica Guillermo Jiménez

El presente repositorio corresponde a la prueba técnica realizada por mi persona (Guillermo Jiménez), el cual cuenta con un login de usuario, la posibilidad de manejar un inventario de productos y ordenes de compra.


## Tabla de contenido
- [Funcionalidades](#Funcionalidades)
- [Instalación del proyecto](#Instalación-del-proyecto)
- [Arquitectura del sistema](#Arquitectura-del-sistema)
  - [¿Por qué esta arquitectura?](#por-qué-esta-arquitectura)
- [TypeScript](#TypeScript)
- [MongoDB](#MongoDB)
- [Librerías Y Frameworks](#Librerías-Y-Frameworks)
- [Rutas de la API](#Rutas-de-la-API)
  -[Autenticación](#Autenticación)
  - [Usuarios](#Usuarios)
  - [Productos](#Productos)
  - [Listado de Productos](#Listado-de-Productos)
  - [Ordenes de compra](#Ordenes-de-compra)

## Funcionalidades

- Registro, login, modificación, eliminación y lista de usuarios.
- Creación, modificación, actualización y eliminación de productos.
- Creación, modificación, actualización y eliminación de listas de productos.
- Creación de ordenes de compra.
- Cambiar estado de la orden de compra.
- Cancelar orden de compra.
- Historial de compras del usuario logueado.

Es importante destacar que las ordenes de compra **no** pueden ser modificadas en contenido ni eliminadas del sistema, ya que es importante mantener un registro de estas acciones a lo largo del tiempo. Al momento de actualizar la orden se cambiara automaticamente al siguiente estado correspondiente del proceso, asi mismo una orden que se encuentra en el estado 'orden recibida' no puede ser cancelada.


## Instalación del proyecto

Instalar el proyecto con npm

```bash
  git clone https://github.com/GuilleJimenez0812/prueba-tecnica.git
  cd prueba-tecnica
  npm install 
  npm run build
  npm run start
```
    
## Arquitectura del sistema

Este proyecto se está desarrollando bajo los principios de la Arquitectura Hexagonal y Domain-Driven Design (DDD), lo que permite una clara abstracción de las capas de infraestructura, aplicación y dominio.

Para facilitar esta abstracción, se ha establecido una estructura de carpetas organizada que encapsula cada sección del código, asegurando así un diseño modular y mantenible.

- controllers
- dto
- middlewares
- repository

    * Interfaces
    * MongoDB

- router
- schemas

    - MongoDB
    - Zod

- services
- utils

### ¿Por qué esta arquitectura?

La arquitectura hexagonal y el Domain-Driven Design (DDD) se complementan de manera efectiva. DDD proporciona un marco detallado para modelar con precisión el núcleo del dominio empresarial, mientras que la arquitectura hexagonal ofrece una metodología para implementar esa lógica de dominio de manera que sea flexible y mantenga un bajo acoplamiento entre componentes[1].

La arquitectura de este proyecto está diseñada para encapsular eficientemente las capas de aplicación, permitiendo modificaciones significativas sin requerir una reescritura del código. Tomemos, por ejemplo, los repositorios y servicios: los servicios utilizan la inyección de dependencia para interactuar con la interfaz del repositorio, que especifica los métodos y sus retornos. La implementación concreta de estos métodos, como se ve en MongoUserRepository.ts, cumple con la interfaz.

Gracias a la inyección de dependencia, los servicios operan independientemente del gestor de base de datos específico, confiando en la estructura proporcionada por los DTOs definidos. Esto facilita cambios significativos, como la sustitución de la base de datos o del ORM, sin afectar los servicios, controladores y DTOs existentes, asegurando así una mayor flexibilidad y mantenibilidad del sistema.

## TypeScript
Las ventajas de usar TypeScript sobre JavaScript incluyen[2]:

- Chequeo de Tipos Estáticos: TypeScript permite especificar tipos de datos para variables, parámetros y valores de retorno, lo que ayuda a prevenir errores en tiempo de ejecución y facilita la depuración del código.
- Soporte Mejorado en IDEs: Los entornos de desarrollo integrados ofrecen un mejor soporte para TypeScript, con funcionalidades como autocompletado de código y sugerencias dinámicas.
- Características Avanzadas de OOP: TypeScript añade características de programación orientada a objetos como clases, interfaces y módulos, que son familiares para desarrolladores con experiencia en otros lenguajes como C# o Java.
- Compatibilidad con Características Futuras de ECMAScript: TypeScript se actualiza constantemente para incluir las últimas características de ECMAScript, permitiendo a los desarrolladores utilizar nuevas funcionalidades del lenguaje antes de que estén ampliamente disponibles.
- Mantenibilidad y Escalabilidad: El tipado estático y la estructura clara del código hacen que TypeScript sea más fácil de mantener y escalar, especialmente en proyectos grandes.
- Ecosistema Robusto: TypeScript tiene una comunidad activa y un ecosistema en crecimiento, con muchas definiciones de tipos disponibles para librerías de JavaScript populares.

## MongoDB
MongoDB es una base de datos NoSQL orientada a documentos que ofrece una gran flexibilidad y escalabilidad, especialmente útil para proyectos que manejan un gran volumen de datos. A diferencia de las bases de datos relacionales, que almacenan datos en tablas y filas, MongoDB utiliza un modelo basado en documentos JSON-like, lo que permite una estructura de datos más dinámica y un esquema flexible[3].

Las ventajas de usar MongoDB sobre una base de datos relacional incluyen[4]:

- Esquemas Flexibles: MongoDB no requiere un esquema fijo, lo que significa que los documentos dentro de una misma colección pueden tener diferentes campos. Esto es ideal para datos que pueden variar o que son incompletos.
- Escalabilidad Horizontal: MongoDB está diseñado para escalar fácilmente de manera horizontal a través del sharding, distribuyendo los datos a través de múltiples servidores para manejar grandes volúmenes de datos y tráfico.
- Rendimiento: Ofrece un alto rendimiento para operaciones de lectura y escritura, y su estilo de computación en memoria para trabajar con datos reduce la necesidad de operaciones de join costosas, comunes en las bases de datos relacionales.
- Desarrollo Ágil: Su modelo de datos se alinea bien con los objetos utilizados en la programación moderna, lo que simplifica el proceso de desarrollo y reduce la necesidad de mapeo de objetos complejos.
- Manejo de Datos Desestructurados: Es ideal para almacenar datos desestructurados o semi-estructurados, lo que es común en aplicaciones modernas que recopilan una variedad de tipos de datos.
## Librerías Y Frameworks

Para la correcta ejecución de este proyecto se utilizaron varias librerias claves. A continuación se cuenta con una breve descripción y la razón de su uso:

- **bcryptjs (^2.4.3):** Se utilizá para mantener las contraseñas encryptadas en todo momento para su seguridad, gracias a esta libreria se almacenan las contraseñas en la base de datos de forma cifrada para su seguridad.

- **compression (^1.7.4):** Es un middleware para Express que comprime las respuestas del servidor, utilizado para mejorar la velocidad y eficiencia en la transferencia de datos.

- **cookie-parser (^1.4.6):** Middleware que analiza las cookies de las peticiones entrantes, esencial para gestionar sesiones y autenticación basada en cookies.

- **cors (^2.8.5):** Middleware para habilitar el intercambio de recursos de origen cruzado (CORS). Permite que el servidor acepte solicitudes de distintos orígenes, ya que este proyecto fue subido a render para hacer "Deploy".

- **dotenv (^16.4.5):** Permite cargar variables de entorno desde un archivo .env, facilitando la configuración del proyecto sin revelar en el código configuraciones sensibles.

- **express (^4.19.2):** Es un framework para Node.Js que facilita la creación de de aplicaciones web y APIs. Es muy reconocido por su rapidez y simplicidad, ofreciendo un conjunto de características para aplicaciones web. Express permite:

    - Configurar middlewares para responder a solicitudes HTTP.
    - Definir rutas de aplicación basadas en métodos HTTP y URLs.
    - Integrar sistemas de renderizado de vistas para generar respuestas HTML.
    - Establecer manejadores de errores con una sintaxis similar a middleware.
    - Servir archivos estáticos y gestionar cookies.
    - Personalizar la configuración del servidor para diferentes entornos de desarrollo.

- **jsonwebtoken (^9.0.2):** JWT es esencial para los procesos de autenticación y autorización. Esta librería permite generar y validar tokens de acceso de manera confiable, asegurando la seguridad de los endpoints sensibles a través de la validación del JWT.

- **mongoose (^8.4.1):** es un ODM (Object Document Mapper) avanzado y popular para manejar MongoDB. Actúa como una capa de abstracción sobre MongoDB. Mongoose proporciona una forma estructurada y esquemática de modelar la información de la aplicación, lo que permite definir tipos de datos, validaciones y consultas complejas de manera sencilla. Mongoose permite:

    - Crear modelos basados en esquemas definidos que representan las colecciones en MongoDB.
    - Aplicar validaciones para asegurar la integridad de los datos.
    - Construir consultas de manera más intuitiva, aprovechando la potencia de JavaScript o TypeScript.
    - Utilizar middleware (pre y post hooks) para ejecutar lógica antes o después de ciertas operaciones de la base de datos.
    - Manejar relaciones entre documentos con población de referencias.

- **zod (^3.23.8):** librería para la validación de datos, utilizada para validar y analizar datos de entrada, asegurando que cumplan con los esquemas definidos antes de su procesamiento o almacenamiento.
## Rutas de la API

### Autenticación

#### Registrar usuario

```http
  POST /auth/register
  Host: https://prueba-tecnica-szwj.onrender.com
  Content-Type: application/json

{
    "email": "testuser@gmail.com",
    "password": "user12345",
    "username": "Test"
}
```
| Body item | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Requerido, Único**. Correo del usuario que se registra.|
|`password`  |`string` |**Requerido**. Contraseña del usuario que se registra.|
|`username`  |`string` |**Requerido**. Nombre de usuario a registrar.|

#### Inicio de sesion de usuario

```http
  POST /auth/login
  Host: https://prueba-tecnica-szwj.onrender.com
  Content-Type: application/json

{
    "email": "testuser@gmail.com",
    "password": "user12345"
}
```
| Body item | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Requerido**. Correo del usuario que se registra.|
|`password`  |`string` |**Requerido**. Contraseña del usuario que se registra.|

### Usuarios

#### Obtener usuarios

```http
  GET /users
  Authorization: Bearer tu-token-aqui
  Host: https://prueba-tecnica-szwj.onrender.com
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `page`      | `number` | **Opcional**. El número de página que deseas recuperar (por defecto es 1) |
|`limit`  |`number` |**Opcional**. La cantidad de usuarios a mostrar por página (por defecto es 10).|

```http
  GET /users?page=1&limit=2
```

#### Modificar Usuario

```http
  PATCH /users/:id
  Authorization: Bearer tu-token-aqui
  Host: https://prueba-tecnica-szwj.onrender.com
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Requerido**. ID del usuario |


#### Eliminar Usuario

```http
  DELETE /users/:id
  Authorization: Bearer tu-token-aqui
  Host: https://prueba-tecnica-szwj.onrender.com
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Requerido**. ID del usuario |

### Productos

#### Obtener Productos

```http
  GET /products
  Authorization: Bearer tu-token-aqui
  Host: https://prueba-tecnica-szwj.onrender.com
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `page`      | `number` | **Opcional**. El número de página que deseas recuperar (por defecto es 1) |
|`limit`  |`number` |**Opcional**. La cantidad de usuarios a mostrar por página (por defecto es 10).|

```http
  GET /products?page=1&limit=2
```

#### Obtener Productos Disponibles

```http
  GET /products-availability
  Authorization: Bearer tu-token-aqui
  Host: https://prueba-tecnica-szwj.onrender.com
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `page`      | `number` | **Opcional**. El número de página que deseas recuperar (por defecto es 1) |
|`limit`  |`number` |**Opcional**. La cantidad de usuarios a mostrar por página (por defecto es 10).|

```http
  GET /products-availability?page=1&limit=2
```

#### Registro de un producto

```http
  POST /products
  Host: https://prueba-tecnica-szwj.onrender.com
  Content-Type: application/json

{
    "product_name": "Nombre_del_producto",
    "description": "Descripción,
    "price": número,
    "availability": número
}
```

| Body item | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `product_name`      | `string` | **Requeridon, Único**. Nombre del producto que se registra.|
|`description`  |`string` |**Requerido**. Descripción del producto que se registra.|
|`price`  |`number` |**Requerido**. Precio del producto a registrar.|
|`availability`  |`number` |**Requerido**. Cantidad disponible en inventario del producto a registrar.|

#### Eliminar Producto

```http
  DELETE /products/:id
  Authorization: Bearer tu-token-aqui
  Host: https://prueba-tecnica-szwj.onrender.com
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Requerido**. ID del producto |

#### Actualizar Producto

```http
  PATCH /products/:id
  Authorization: Bearer tu-token-aqui
  Host: https://prueba-tecnica-szwj.onrender.com

{
    "product_name": "Nombre_del_producto",
    "description": "Descripción,
    "price": número,
    "availability": número
}
```


| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Requerido**. ID del usuario |

| Body item | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `product_name`      | `string` | **Opcional, Único**. Nombre del producto que se registra.|
|`description`  |`string` |**Opcional**. Descripción del producto que se registra.|
|`price`  |`number` |**Opcional**. Precio del producto a registrar.|
|`availability`  |`number` |**Opcional**. Cantidad disponible en inventario del producto a registrar.|

### Listado de Productos

#### Registro de un producto

```http
  POST /products/batch
  Host: https://prueba-tecnica-szwj.onrender.com
  Content-Type: application/json

[
    {
        "product_name": "Nombre_del_producto_1",
        "description": "Descripción_1",
        "price": número,
        "availability": número
    },
    {
        "product_name": "Nombre_del_producto_2",
        "description": "Descripción_2",
        "price": número,
        "availability": número
    }
]
```
| Body item | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `product_name`      | `string` | **Requerido, Único**. Nombre del producto que se registra.|
|`description`  |`string` |**Requerido**. Descripción del producto que se registra.|
|`price`  |`number` |**Requerido**. Precio del producto a registrar.|
|`availability`  |`number` |**Requerido**. Cantidad disponible en inventario del producto a registrar.|

#### Actualizar varios productos

```http
  POST /products-batch
  Host: https://prueba-tecnica-szwj.onrender.com
  Content-Type: application/json

[
    {
        "_id": "ID_del_producto_1",
        "product_name": "Nombre_del_producto_1",
        "description": "Descripción_1",
        "price": número,
        "availability": número
    },
    {
        "_id": "ID_del_producto_2",
        "product_name": "Nombre_del_producto_2",
        "description": "Descripción_2",
        "price": número,
        "availability": número
    }
]
```
| Body item | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `_id`      | `string` | **Requerido, Único**. ID del producto que se registra.|
| `product_name`      | `string` | **Opcional, Único**. Nombre del producto que se registra.|
|`description`  |`string` |**Opcional**. Descripción del producto que se registra.|
|`price`  |`number` |**Opcional**. Precio del producto a registrar.|
|`availability`  |`number` |**Opcional**. Cantidad disponible en inventario del producto a registrar.|

#### Eliminar varios productos

```http
  DELETE /products-batch
  Host: https://prueba-tecnica-szwj.onrender.com
  Content-Type: application/json

[
    "ID_del_producto_1", "ID_del_producto_2"
]
```
| Body item | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `array`      | `string[]` | **Requerido**. Arreglo de IDs de los productos que se eliminan.|

### Ordenes de compra

#### Crear Orden

```http
  POST /orders
  Host: https://prueba-tecnica-szwj.onrender.com
  Content-Type: application/json

{
    "products": ["ID_del_producto_1", "ID_del_producto_2"],
    "quantity": [cantidad_solicitada_del_producto_1, cantidad_solicitada_del_producto_2]
}
```

| Body item | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `products`      | `string[]` | **Requeridon, Único**. IDs de los productos que se solicítan.|
|`quantity`  |`number[]` |**Requerido**. Cantidad de los productos solicitados, deben estar en el mismo orden que los productos.|

#### Obtener Orden

```http
  GET /orders/:id
  Authorization: Bearer tu-token-aqui
  Host: https://prueba-tecnica-szwj.onrender.com
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Requerido**. ID de la orden |

#### Obtener Ordenes por usuario logueado

```http
  GET /orders-user
  Authorization: Bearer tu-token-aqui
  Host: https://prueba-tecnica-szwj.onrender.com
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `page`      | `number` | **Opcional**. El número de página que deseas recuperar (por defecto es 1) |
|`limit`  |`number` |**Opcional**. La cantidad de usuarios a mostrar por página (por defecto es 10).|

```http
  GET /orders-user?page=1&limit=10
```

#### Cambiar estado de la Orden

```http
  PATCH /orders-status/:id
  Authorization: Bearer tu-token-aqui
  Host: https://prueba-tecnica-szwj.onrender.com
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Requerido**. ID de la orden |

Para el estado de la orden se definió que la orden puede tener los estados:
- 'validating order'
- 'order sent'
- 'order received'
- 'canceled'
Para evitar posibles errores el sistema actualiza el estado de la orden automáticamente al siguiente, tomando en cuenta que 'order received' es el último y una orden con este estado no se puede cancelar.

#### Cancelar la Orden

```http
  PATCH /orders-cancel/:order_id
  Authorization: Bearer tu-token-aqui
  Host: https://prueba-tecnica-szwj.onrender.com
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `order_id`      | `string` | **Requerido**. ID de la orden |

Es importante destacar que no se deberían eliminar las órdenes de compra bajo ningún concepto, ya que esto puede representar información clave y valiosa para el cliente.
## FAQ

#### ¿Cúal es la diferencia entre ORM y ODM?

Un ODM está diseñado específicamente para mapear objetos a documentos en bases de datos como MongoDB, mientras que un ORM mapea objetos a registros en tablas de bases de datos relacionales.


## Bibliografía
[1] Yavé Guadaño Ibáñez                 Desde 2006, “Patrones de Arquitectura: Organización y Estructura de microservicios,” Paradigma, https://www.paradigmadigital.com/dev/patrones-arquitectura-organizacion-estructura-microservicios/#:~:text=La%20arquitectura%20hexagonal%20y%20DDD,un%20diseño%20flexible%20y%20desacoplado. (accessed Jun. 13, 2024). 

[2] “Typescript vs JavaScript: Which one you should use, and why,” SitePoint, https://www.sitepoint.com/typescript-vs-javascript/ (accessed Jun. 13, 2024). 

[3] “Advantages of mongodb,” MongoDB, https://www.mongodb.com/resources/compare/advantages-of-mongodb (accessed Jun. 13, 2024). 

[4] Waleed, “MongoDB vs SQL databases: A comprehensive comparison,” RedSwitches, https://www.redswitches.com/blog/mongodb-vs-sql/ (accessed Jun. 13, 2024). 