class EvaluacionCompetenciaPorCargo extends Evaluacion360 {


    CARGAR_EVALUADOS = "CARGAR_EVALUADOS_PARA_COMPETENCIAS_POR_CARGO";
    CARGAR_EVALUACIONES = "CARGAR_EVALUACIONES_COMPETENCIAS_POR_CARGO";
    GUARDAR_ITEM_EVALUACION = "GUARDAR_ITEM_EVALUACION_COMPETENCIAS_POR_CARGO";
    CARGAR_COMPETENCIAS = "CARGAR_COMPETENCIAS_POR_CARGO_PARA_UN_EVALUADO";

    constructor() {
        super("evaluacionCompetenciasPorCargo",
            new KLauncherInfoClass("Competencias por cargo", 0, "system", true, "competencias.png")
        );
    }
}

new EvaluacionCompetenciaPorCargo().register();