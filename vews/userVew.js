let panelUserCreateEl = document.getElementById("box-user-create");
let panelUserUpdateEl = document.getElementById("box-user-update");
let tableUsersEl = document.getElementById("table-users");

// const userController = new UserController("form-user-create", "table-users");
const userController = new UserController(panelUserCreateEl, panelUserUpdateEl, tableUsersEl);



