class UserController {

    constructor(formId, tableId) {

        this._formEl = document.getElementById(formId);
        this._tableEl = document.getElementById(tableId);

        //this.onSubmitUser();
        
    }


    //Retorna o objeto com os valores do usuário
    getValuesUser() {

        const user = {}; //JSON USER

        //Utiliza-se o spred criando um Array para funcionalidade do forEach
        [...this._formEl.elements].forEach(e => {

            if (e.name == "gender") {

                if (e.checked) { user[e.name] = e.value; }

            } else if (e.name == "admin") {

                user[e.name] = e.checked;

            } else {
                user[e.name] = e.value;
            }

        });

        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );

    } // Close getValuesUser
}