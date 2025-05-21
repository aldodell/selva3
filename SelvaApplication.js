class SelvaApplication extends KApplicationClass {

    server = "servidor-selva3.php";

    //Usuario actual
    static user = KAnonymousUser;

    //pantalla inicial
    initScreen;

    //Controlador de navegación
    navigationController = KNavigationController;


    /**
     * @override Este método en cada aplicaciom
     * @returns KScreen object
     */
    getInitScreen() {

        //Retornamos la pantalla inicial si ya fue definida
        //Hay que poner esto en todas las aplicaciones
        // if (this.initScreen) return this.initScreen;

        return KScreen(this.launcherInfo.description)
            .getBody((body) => {
                body
                    .applySimpleRoundedBorder()
                    .applySimpleBackgroundColor("white")
                    .addCssText("overflow: scroll;")

            })
            .getHead((head) => {
                head
                    .add(
                        KLabel(SelvaApplication.user.name).addCssText("margin-left:auto;")
                    )
            });

    }

    loadData() {
        throw new IllegalStateException("Not implemented");
    }

    run() {
        super.run();
        this.loadData();
    }


    constructor(name, launcherInfoWrapper) {
        super(name, launcherInfoWrapper);

        SelvaApplication.user.payload.CEDULA = "";

        if (localStorage.getItem("user") != null) {
            let u = JSON.parse(localStorage.getItem("user"));
            SelvaApplication.user = KUser(u.name, u.payload);
        }
    }
    /*
     constructor(description = "App", order = 0, group = "Apps", show = true, icon = "terminal.png", payload = {}) {
   */
}