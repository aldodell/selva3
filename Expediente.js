/**
 * Lista el expediente de los trabajadores
 */
class Expendiente extends SelvaApplication {

    getInitScreen() {

        //Retornamos la pantalla inicial si ya fue definida
        if (this.initScreen) return this.initScreen;

        let initScreen = super.getInitScreen()
            .add(
                KDataView(
                    (dataView, row) => {
                        return KRow(
                            KButton(row.CEDULA, "CEDULA")
                                .addCssText("flex-basis: 200px;")
                                .addEvent("click", () => {
                                    let payload = { "CEDULA": row.CEDULA };
                                    KMessage("ficha", payload, "run").send();
                                }),
                            KText("", "NOMBRES_APELLIDOS").setSize(500),
                            KText("", "COMPANIA").setSize(300),
                            KText("", "TIPO_NOMINA").setSize(100),
                            KText("", "DEPARTAMENTO").setSize(400),
                            KText("", "CARGO").setSize(400),
                            KText("", "NIVEL").setSize(200),
                            KText("", "UNIDAD_DE_NEGOCIO").setSize(400),

                        )
                            .setData(row)

                    },
                    this.data)
                    .getMe((dataView) => {
                        this.dataView = dataView;
                    })

            ).getFoot((foot) => {
                foot.add(
                    KText("")
                        .setPlaceholder("Buscar...")
                        .addEvent("input", (e) => {
                            let text = e.target.self.getValue();
                            this.search(text);

                        })
                )
            })

        return initScreen;
    }

    search(text) {
        if (text.length > 2) {

            let filteredData = this.data.filter((row) => {

                for (let p in row) {
                    if (row[p] == undefined) {
                        row[p] = "";
                    }

                    if (typeof row[p] == "number" || typeof row[p] == "boolean" || typeof row[p] == "object") {
                        row[p] = row[p].toString();
                    }
                }

                return row.CEDULA.toString().toLowerCase().includes(text.toLowerCase()) ||
                    row.NOMBRES_APELLIDOS.toLowerCase().includes(text.toLowerCase()) ||
                    row.COMPANIA.toLowerCase().includes(text.toLowerCase()) ||
                    row.TIPO_NOMINA.toLowerCase().includes(text.toLowerCase()) ||
                    row.DEPARTAMENTO.toLowerCase().includes(text.toLowerCase()) ||
                    row.CARGO.toLowerCase().includes(text.toLowerCase()) ||
                    row.NIVEL.toLowerCase().includes(text.toLowerCase()) ||
                    row.UNIDAD_DE_NEGOCIO.toLowerCase().includes(text.toLowerCase())

            })
            this.dataView.clear();
            this.dataView.setArrayData(filteredData);
        }
        if (text.length == 0) {
            this.dataView.clear();
            this.dataView.setArrayData(this.data);
        }

    }



    /**
     * Carga la informacion de los trabajadores
     */
    loadData() {
        KMessage("servidor", {}, "CARGAR_TRABAJADORES")
            .send(this.server)
            .then(data => {
                this.data = JSON.parse(data);
                //Navega a la pantalla inicial
                this.navigationController.navigateTo(this.getInitScreen());
            })
            .catch(err => { console.log(err); });
    }


    constructor() {
        super("expediente",
            new KLauncherInfoClass("Expediente", 0, "system", true, "expediente.png", 32)
        );

    }
}

new Expendiente().register();