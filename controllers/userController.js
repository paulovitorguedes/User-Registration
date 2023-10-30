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





    getPhoto() {
        //O promise é executado de forma assincrona 
        return new Promise((resolve, reject) => {

            //API do FileReader usada para ler o conteúdo do arquivo selecionado e criar a URL
            let fileReader = new FileReader();

            let element = [...this._formEl.elements].filter(e => {
                if (e.name === 'photo') {
                    return e;
                }
            });

            //Função de callBack para quando o PC finalizar a leituta do arquivo
            fileReader.onload = () => {

                resolve(fileReader.result);

            }

            fileReader.onerror = (e) => {

                reject(e);
            }


            let file = element[0].files[0];

            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/boxed-bg.jpg');
            }
        });
    } //Close getPhoto

    // getPhoto(calback) {
    //     //API do FileReader usada para ler o conteúdo do arquivo selecionado e criar a URL
    //     let fileReader = new FileReader();

    //     let element = [...this._formEl.elements].filter(e => {
    //         if (e.name === 'photo') {
    //             return e;
    //         }
    //     })  

    //     //Função de callBack para quando o PC finalizar a leituta do arquivo
    //     fileReader.onload = () => {

    //         calback(fileReader.result);

    //     }

    //     let file = element[0].files[0];
    //     fileReader.readAsDataURL(file);

    // } //Close getPhoto
}