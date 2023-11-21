class UserModel {

    //Realiza um select no sessionStorage e retorna um object JSON user 
    static selectStorageUser() {

        let users = [];

        if (sessionStorage.getItem('keyUsers')) {
            users = JSON.parse(sessionStorage.getItem('keyUsers'));
        }

        return users;


    } //close selectStorageUser




    //Adiciona os dados do usuário na Session Storage
    static addStorageUser(dataUser) {

        let users = this.selectStorageUser();

        users.push(dataUser);
        sessionStorage.setItem('keyUsers', JSON.stringify(users));

    }//close addStorageUser


}









