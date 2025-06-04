select COMPANIA, 4*AVG(t.autoevalucion), 4*AVG(t.jefe), 4*AVG(t.colaboradores), 4*AVG(t.pares) 
FROM
(SELECT ex1.COMPANIA as COMPANIA, round(25*avg(ev.calificacion)) as autoevalucion, 0 as jefe, 0 as colaboradores, 0 as pares
from 

evaluaciones360 ev 
INNER JOIN
expediente ex1 on ev.idEvaluado = ex1.CEDULA
INNER JOIN
expediente ex2 on ev.idEvaluador = ex2.CEDULA
WHERE
ev.idPeriodo = 1
AND
ev.calificacion>0
AND
ex1.CEDULA = ex2.CEDULA

GROUP BY
ex1.COMPANIA

UNION
 
 SELECT ex1.COMPANIA as COMPANIA, 0 as autoevalucion, round(25*avg(ev.calificacion)) as jefe, 0 as colaboradores, 0 as pares
from 

evaluaciones360 ev 
INNER JOIN
expediente ex1 on ev.idEvaluado = ex1.CEDULA
INNER JOIN
expediente ex2 on ev.idEvaluador = ex2.CEDULA
WHERE
ev.idPeriodo = 1
AND
ev.calificacion>0
AND
ex1.CEDULA_LIDER = ex2.CEDULA

GROUP BY
ex1.COMPANIA

UNION
 
 SELECT ex1.COMPANIA as COMPANIA,  0 as autoevalucion , 0 as jefe , round(25*avg(ev.calificacion)) as colaboradores ,0 as pares
from 

evaluaciones360 ev 
INNER JOIN
expediente ex1 on ev.idEvaluado = ex1.CEDULA
INNER JOIN
expediente ex2 on ev.idEvaluador = ex2.CEDULA
WHERE
ev.idPeriodo = 1
AND
ev.calificacion>0
AND
ex1.CEDULA = ex2.CEDULA_LIDER

GROUP BY
ex1.COMPANIA
 
 UNION
 
 
 SELECT ex1.COMPANIA as COMPANIA,  0 as autoevalucion, 0 as jefe, 0 as colaboradores, round(25*avg(ev.calificacion)) as pares
 
 from 

evaluaciones360 ev 
INNER JOIN
expediente ex1 on ev.idEvaluado = ex1.CEDULA
INNER JOIN
expediente ex2 on ev.idEvaluador = ex2.CEDULA
WHERE
ev.idPeriodo = 1
AND
ev.calificacion>0
AND
ex1.CEDULA <> ex2.CEDULA_LIDER -- no es subordinado
AND
ex1.CEDULA_LIDER <> ex2.CEDULA -- no es el jefe
AND
ex1.CEDULA <> ex2.CEDULA -- no es auto

GROUP BY
ex1.COMPANIA
) as t;













--Promedio de las compa;ia

SELECT ex1.COMPANIA, round(25*avg(ev.calificacion)) as c
from 

evaluaciones360 ev 
INNER JOIN
expediente ex1 on ev.idEvaluado = ex1.CEDULA
INNER JOIN
expediente ex2 on ev.idEvaluador = ex2.CEDULA
WHERE
ev.idPeriodo = 1
AND
ev.calificacion>0

GROUP BY
ex1.COMPANIA;




SELECT COMPANIA, sum(autoevalucion) as autoevalucion, sum(jefe) as jefe, sum(colaboradores) as colaboradores, sum(pares) as pares FROM
(
------ autoevalucion
SELECT ex1.COMPANIA as COMPANIA, round(25*avg(ev.calificacion)) as autoevalucion, 0 as jefe, 0 as colaboradores, 0 as pares
from 

evaluaciones360 ev 
INNER JOIN
expediente ex1 on ev.idEvaluado = ex1.CEDULA
INNER JOIN
expediente ex2 on ev.idEvaluador = ex2.CEDULA
WHERE
ev.idPeriodo = 1
AND
ev.calificacion>0
AND
ex1.CEDULA = ex2.CEDULA

GROUP BY
ex1.COMPANIA;

union

-- evaluaciones que hace le jefe
SELECT ex1.COMPANIA as COMPANIA, round(25*avg(ev.calificacion)) as jefe, 0 as autoevalucion , 0 as colaboradores, 0 as pares
from 

evaluaciones360 ev 
INNER JOIN
expediente ex1 on ev.idEvaluado = ex1.CEDULA
INNER JOIN
expediente ex2 on ev.idEvaluador = ex2.CEDULA
WHERE
ev.idPeriodo = 1
AND
ev.calificacion>0
AND
ex1.CEDULA_LIDER = ex2.CEDULA

GROUP BY
ex1.COMPANIA;

union

-- evlauciones que hace los subordinados
SELECT ex1.COMPANIA as COMPANIA, round(25*avg(ev.calificacion)) as colaboradores , 0 as autoevalucion , 0 as jefe , 0 as pares
from 

evaluaciones360 ev 
INNER JOIN
expediente ex1 on ev.idEvaluado = ex1.CEDULA
INNER JOIN
expediente ex2 on ev.idEvaluador = ex2.CEDULA
WHERE
ev.idPeriodo = 1
AND
ev.calificacion>0
AND
ex1.CEDULA = ex2.CEDULA_LIDER

GROUP BY
ex1.COMPANIA;

union

-- evalucion de los pares   
SELECT ex1.COMPANIA as COMPANIA, round(25*avg(ev.calificacion)) as pares  , 0 as autoevalucion , 0 as jefe , 0 as  colaboradores

from 

evaluaciones360 ev 
INNER JOIN
expediente ex1 on ev.idEvaluado = ex1.CEDULA
INNER JOIN
expediente ex2 on ev.idEvaluador = ex2.CEDULA
WHERE
ev.idPeriodo = 1
AND
ev.calificacion>0
AND
ex1.CEDULA <> ex2.CEDULA_LIDER -- no es subordinado
AND
ex1.CEDULA_LIDER <> ex2.CEDULA -- no es el jefe
AND
ex1.CEDULA <> ex2.CEDULA -- no es auto

GROUP BY
ex1.COMPANIA;
)