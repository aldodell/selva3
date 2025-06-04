class ReporteSelva extends SelvaApplication {

    titulo1 = "font-size: 1.5em; font-weight: bold; color:navy; font-family: Verdana; background-color:transparent; border:none; margin:0; padding:0;";
    titulo1s = this.titulo1 + "text-decoration: underline;";

    titulo2 = this.titulo1 + "font-size: 1.0em;";
    titulo2s = this.titulo2 + "text-decoration: underline;";


    navigationController = KNavigationController;
    report;

    periodos = KDataList();
    selectorPeriodo = KSelect(this.periodos, "idPeriodo")


    tituloPrincipal = "Ejemplo de reporte"

    configureReport() {

    }

    getReport() {

        //Singleton pattern
        if (this.report != undefined) { return this.report; }

        this.report = KPaperSheet()
            .addCssText("padding-top:0.5cm;")
            .add(
                // <---- Logo --->
                KRow(
                    KImage("media/grupo_selva_logo.png")
                        .setSize(120, 100)
                ),
                // <---- Título principal --->
                KRow(
                    KParagraph(this.tituloPrincipal)
                        .addCssText(this.titulo1),
                    this.selectorPeriodo
                        .addCssText(this.titulo1s)
                        .addCssText("margin-left:8px;")
                        .addEvent("change", () => this.loadData())

                )
                    .setSize("100%")
                    .center()
                    .addCssTextOnChildren("font-family: Verdana;")
                ,

                KRow(

                )
                    .setSize("100%")
                    .center(),
            )

        this.configureReport();
        return this.report;
    }

    loadData() {

        KMessage("", "", "CARGAR_PERIODOS")
            .send(this.server)
            .then((data) => {
                this.periodos.clear();
                this.selectorPeriodo.clear();
                this.periodos.addOptions(JSON.parse(data));
                this.selectorPeriodo.importDataList(this.periodos);
            });



    }

    run() {
        this.getReport().setCloseCallback(() => {
            this.navigationController.back();
        });

        this.getReport().setPrintCallback(() => {
            window.print();
        });

        this.navigationController.navigateTo(this.getReport());
        this.loadData();
    }


    constructor(name = "reporteSelva", launcherInfoWrapper = new KLauncherInfoClass("Reporte Selva", 0, "system", false)) {
        super(name, launcherInfoWrapper);
    }
}

new ReporteSelva().register();