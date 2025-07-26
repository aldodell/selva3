class Entrada extends SelvaApplication {
    blockData;

    validarUsuario() {

        //Obtenemos los datos del formulario
        let payload = this.blockData.getData();

        //Hacemos la petición al servidor para validar el usuario
        KMessage("servidor", payload, "VALIDAR_USUARIO")
            .send(this.server)
            .then(data => {


                //Parseamos la respuesta
                data = JSON.parse(data);

                if (!data) {
                    //No pasó la validación
                    alert("Usuario desconocido o contraseña incorrecta.");
                } else {

                    //Sí pasó la validación
                    let user = KUser(data.EMAIL, data);
                    user.securityLevel = data.NIVEL_SEGURIDAD;
                    SelvaApplication.user = user;
                    localStorage.setItem("user", JSON.stringify(user));
                    KLauncher.setUser(user).update();


                }
                //Navega a la pantalla inicial
                this.navigationController.back();
            })
            .catch(err => { console.log(err); });
    }


    //Obtiene la pantalla inicial
    getInitScreen() {

        if (this.initScreen) return this.initScreen;

        let initScreen = super.getInitScreen();

        initScreen.add(
            KColumn(
                KImage("media/grupo_selva_logo.png").addCssText("margin-bottom: 20px;"),
                KColumn(
                    KText("", "EMAIL").setSize(200).setPlaceholder("Email").getMe((me) => this.email = me),
                    KPassword("", "PIN").setSize(200).setPlaceholder("Password").getMe((me) => this.pin = me),
                ).getMe((me) => this.blockData = me)
                ,
                KButton("Ingresar", "ingresar").setSize(200).setMargin("10px")
                    .addEvent("click", () => this.validarUsuario())
            )

                .setSize("400px", "400px")
                .applySimpleRoundedBorder()
                .center()

        )
            .getBody((body) => {
                body.center();
            })

        this.initScreen = initScreen;
        return initScreen;
    }

    loadData() {
        this.navigationController.navigateTo(this.getInitScreen());

        //Cargamos el usuario local
        let user = localStorage.getItem("user");

        if (user) {
            user = JSON.parse(user);
            SelvaApplication.user = user;
            this.blockData.setData(user.payload);
        }
    }

    run(message) {
        debugger;
        this.getInitScreen();
        let email = message.payload.email ?? "";
        let pin = message.payload.pin ?? "";
        this.email.setValue(email);
        this.pin.setValue(pin);
        super.run();
    }


    constructor() {
        super("entrada",
            new KLauncherInfoClass("Entrada", 0, "system", true, "puerta.png", 0));
    }
}
new Entrada().register();