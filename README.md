
# Prueba técnica Guillermo Jiménez

El presente repositorio corresponde a la prueba técnica realizada por mi persona (Guillermo Jiménez), el cual cuenta con un login de usuario, la posibilidad de manejar un inventario de productos y ordenes de compra.


## Tabla de contenido
- Funcionalidades
- Instalación
## Funcionalidades

- Registro, login, modificación, eliminación y lista de usuarios.
- Creación, modificación, actualización y eliminación de productos.
- Creación, modificación, actualización y eliminación de listas de productos.
- Creación de ordenes de compra.
- Cambiar estado de la orden de compra.
- Cancelar orden de compra.
- Historial de compras del usuario logueado.

Es importante destacar que las ordenes de compra **no** pueden ser modificadas en contenido ni eliminadas del sistema, ya que es importante mantener un registro de estas acciones a lo largo del tiempo. Al momento de actualizar la orden se cambiara automaticamente al siguiente estado correspondiente del proceso, asi mismo una orden que se encuentra en el estado 'orden recibida' no puede ser cancelada.


## Installation

Instalar el proyecto con npm

```bash
  git clone https://github.com/GuilleJimenez0812/prueba-tecnica.git
  cd prueba-tecnica
  npm install 
  npm run build
  npm start
```
    
## Arquitectura del sistema

Para el desarrollo de este proyecto se esta aplicando los principios de la Arquitectura Hexagonal y los principios de Domain Driven Design para poder abtraer las capas de infraestructura, aplicacón y dominio. 

Para lograr esto se definio una estructura de carpetas para encapsular cada apartado del código: 

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

