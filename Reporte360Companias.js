class Reporte360Companias extends ReporteSelva {


    configureReport() {


        this.selectorPeriodo.addEvent("change", () => {
            this.loadData2();
        });


        this.getReport().add(
            KRow().add(
                KLabel("Promedio total: ").addCssText("font-weight: bold;"),
                KLabel(this.promedioTotal).addCssText("font-weight: bold;")
                    .getMe((me) => this.promedioTotalLabel = me)
            )
        );
    }


    loadData2() {
        let payload = {
            idPeriodo: this.selectorPeriodo.getValue()
        }
        //Obtenemos el promedio de Venezuela, total:
        KMessage("servidor", payload, "CALCULAR_PROMEDIO_360_NACIONAL", payload)
            .send(this.server)
            .then((data) => {
                this.promedioTotal = data;
                this.promedioTotalLabel.setValue(`Promedio total: ${this.promedioTotal}`);
            });

    }


    loadData() {
        super.loadData();
        this.getReport();

    }
    constructor() {
        super("reporte360Companias",
            new KLauncherInfoClass("Reporte 360 Compañías", 0, "system", true));
    }
}

new Reporte360Companias().register();