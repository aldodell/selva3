SELECT t.COMPANIA,
    SUM(t.autoevaluacion) as autoevaluacion,
    SUM(t.jefe) as jefe,
    SUM(t.colaboradores) as colaboradores,
    SUM(t.pares) as pares,
    SUM(
        t.autoevaluacion + t.jefe + t.colaboradores + t.pares
    ) /(
        if(sum(t.autoevaluacion) > 0, 1, 0) + if(sum(t.jefe) > 0, 1, 0) + if(sum(t.colaboradores) > 0, 1, 0) + if(sum(t.pares) > 0, 1, 0)
    ) as promedio
FROM (
        -- AUTOEVALUACION
        SELECT ex1.COMPANIA,
            ROUND(25 * AVG(ev.calificacion)) as autoevaluacion,
            0 as jefe,
            0 as colaboradores,
            0 as pares
        FROM evaluaciones360 ev
            INNER JOIN expediente ex1 on ev.idEvaluado = ex1.CEDULA
            INNER JOIN expediente ex2 on ev.idEvaluador = ex2.CEDULA
        WHERE ev.idPeriodo = ?
            AND ev.calificacion > 0
            AND ex1.CEDULA = ex2.CEDULA -- autoevaluacion
        GROUP BY ex1.COMPANIA
        UNION
        -- JEFE
        SELECT ex1.COMPANIA,
            0 as autoevaluacion,
            ROUND(25 * AVG(ev.calificacion)) as jefe,
            0 as colaboradores,
            0 as pares
        FROM evaluaciones360 ev
            INNER JOIN expediente ex1 on ev.idEvaluado = ex1.CEDULA
            INNER JOIN expediente ex2 on ev.idEvaluador = ex2.CEDULA
        WHERE ev.idPeriodo = ?
            AND ev.calificacion > 0
            AND ex1.CEDULA_LIDER = ex2.CEDULA -- jefe
        GROUP BY ex1.COMPANIA
        UNION
        -- COLABORADORES    
        SELECT ex1.COMPANIA,
            0 as autoevaluacion,
            0 as jefe,
            ROUND(25 * AVG(ev.calificacion)) as colaboradores,
            0 as pares
        FROM evaluaciones360 ev
            INNER JOIN expediente ex1 on ev.idEvaluado = ex1.CEDULA
            INNER JOIN expediente ex2 on ev.idEvaluador = ex2.CEDULA
        WHERE ev.idPeriodo = ?
            AND ev.calificacion > 0
            AND ex1.CEDULA = ex2.CEDULA_LIDER -- colaboradores
        GROUP BY ex1.COMPANIA
        UNION
        -- PARES
        SELECT ex1.COMPANIA,
            0 as autoevaluacion,
            0 as jefe,
            0 as colaboradores,
            ROUND(25 * AVG(ev.calificacion)) as pares
        FROM evaluaciones360 ev
            INNER JOIN expediente ex1 on ev.idEvaluado = ex1.CEDULA
            INNER JOIN expediente ex2 on ev.idEvaluador = ex2.CEDULA
        WHERE ev.idPeriodo = ?
            AND ev.calificacion > 0
            AND ex1.CEDULA <> ex2.CEDULA_LIDER -- no es subordinado
            AND ex1.CEDULA_LIDER <> ex2.CEDULA -- no es el jefe
            AND ex1.CEDULA <> ex2.CEDULA -- no es auto
        GROUP BY ex1.COMPANIA
    ) as T
GROUP BY COMPANIA;