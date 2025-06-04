class Entrada extends SelvaApplication {
    blockData;

    validarUsuario() {

        let payload = this.blockData.getData();

        KMessage("servidor", payload, "VALIDAR_USUARIO")
            .send(this.server)
            .then(data => {

                data = JSON.parse(data);

                if (!data) {
                    alert("Usuario o contraseña incorrectos");
                } else {

                    let user = KUser(data.EMAIL, data);

                    SelvaApplication.user = user;
                    localStorage.setItem("user", JSON.stringify(user));

                }
                //Navega a la pantalla inicial
                this.navigationController.back();
            })
            .catch(err => { console.log(err); });
    }


    getInitScreen() {

        if (this.initScreen) return this.initScreen;

        let initScreen = super.getInitScreen();

        initScreen.add(
            KColumn(
                KImage("media/grupo_selva_logo.png").addCssText("margin-bottom: 20px;"),
                KColumn(
                    KText("", "EMAIL").setSize(200).setPlaceholder("Email"),
                    KPassword("", "PIN").setSize(200).setPlaceholder("Password"),
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

        let user = localStorage.getItem("user");
        if (user) {
            user = JSON.parse(user);
            SelvaApplication.user = user;
            this.blockData.setData(user.payload);
        }
    }


    constructor() {
        super("entrada",
            new KLauncherInfoClass("Entrada", 0, "system", true));
    }
}
new Entrada().register();