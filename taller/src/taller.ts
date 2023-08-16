import * as readlineSync from 'readline-sync';
class Centro {
    constructor(public nombre: string)
     {}
}

class Ruta {
    constructor(public nombre: string, public centro: Centro)
     {}
}

class Nivel {
    constructor(public nombre: string, public ruta: Ruta) 
    {}
}

class Camper {
    constructor(public nombre: string) 
    {}
}

class Contrato {
    constructor(public camper: Camper, public nivel: Nivel, public tipoContrato: 'remoto' | 'presencial') 
    {}
}

class SistemaGestion {
    public centros: Map<string, Centro> = new Map();
    public rutas: Map<string, Ruta> = new Map();
    public niveles: Map<string, Nivel> = new Map();
    public campers: Map<string, Camper> = new Map();
    public contratos: Contrato[] = [];

    registrarCentro() {
        let nombre = readlineSync.question('Ingrese el nombre del centro: ');
        let centro = new Centro(nombre);
        this.centros.set(nombre, centro);
        return centro;
    }

    registrarRuta(centro: Centro) {
        let nombre = readlineSync.question('Ingrese el nombre de la ruta: ');
        let ruta = new Ruta(nombre, centro);
        this.rutas.set(nombre, ruta);
        return ruta;
    }

    registrarNivel(ruta: Ruta) {
        let nombre = readlineSync.question('Ingrese el nombre del nivel: ');
        let nivel = new Nivel(nombre, ruta);
        this.niveles.set(nombre, nivel);
        return nivel;
    }
    registrarCamper() {
        let nombre = readlineSync.question('Ingrese el nombre del camper: ');
        let camper = new Camper(nombre);
        this.campers.set(nombre, camper);
        return camper;
    }
    contratarCamper() {
        let camperNombre = readlineSync.question('Ingrese el nombre del camper a contratar: ');
        let nivelNombre = readlineSync.question('Ingrese el nombre del nivel para el contrato: ');
        let tipoContrato = readlineSync.question('Ingrese el tipo de contrato (1 para remoto, 2 para presencial): ');
    
        let camper = this.campers.get(camperNombre);
        let nivel = this.niveles.get(nivelNombre);
    
        if (!camper || !nivel) {
            console.log('Camper o nivel no encontrados.');
            return;
        }
    
        let contrato = new Contrato(camper, nivel, tipoContrato === '1' ? 'remoto' : 'presencial');
        this.contratos.push(contrato);
        return contrato;
    }
    

    getCampersNvl(nivel: Nivel) {
        return this.contratos
            .filter(contrato => contrato.nivel === nivel)
            .map(contrato => contrato.camper);
    }

    getCampersTipoContr(tipo: 'remoto' | 'presencial') {
        let centrosArray = [...this.centros.values()];
        let centroConTipo = centrosArray.find(centro => centro.nombre.includes(tipo));
        if (!centroConTipo) {
            return [];
        }
        return this.contratos
            .filter(contrato => contrato.nivel.ruta.centro === centroConTipo)
            .map(contrato => contrato.camper);
    }
    

    getCentroMayor() {
        let centroMap = new Map<Centro, number>();

        for (let contrato of this.contratos) {
            let centro = contrato.nivel.ruta.centro;
            centroMap.set(centro, (centroMap.get(centro) || 0) + 1);
        }

        let [centroMayor] = [...centroMap.entries()].reduce((max, entry) =>
            entry[1] > max[1] ? entry : max
        );

        return centroMayor;
    }

    getCentroMenor() {
        let centroMap = new Map<Centro, number>();

        for (let contrato of this.contratos) {
            let centro = contrato.nivel.ruta.centro;
            centroMap.set(centro, (centroMap.get(centro) || 0) + 1);
        }

        let [centroMenor] = [...centroMap.entries()].reduce((min, entry) =>
            entry[1] < min[1] ? entry : min
        );

        return centroMenor;
    }
}

let sistema = new SistemaGestion();

while (true) {
    console.log('1. Registrar Centro');
    console.log('2. Registrar Ruta');
    console.log('3. Registrar Nivel');
    console.log('4. Registrar Camper');
    console.log('5. Contratar Camper');
    console.log('6. Salir');

    let opcion = readlineSync.question('Ingrese el número de la opción: ');

    switch (opcion) {
        case '1':
            sistema.registrarCentro();
            break;
        case '2':
            let centroNombre = readlineSync.question('Ingrese el nombre del centro: ');
            let centro = sistema.centros.get(centroNombre);
            if (!centro) {
                console.log('Centro no encontrado.');
            } else {
                sistema.registrarRuta(centro);
            }
            break;
        case '3':
            let rutaNombre = readlineSync.question('Ingrese el nombre de la ruta: ');
            let ruta = sistema.rutas.get(rutaNombre);
            if (!ruta) {
                console.log('Ruta no encontrada.');
            } else {
                sistema.registrarNivel(ruta);
            }
            break;
        case '4':
            sistema.registrarCamper();
            break;
        case '5':
            sistema.contratarCamper();
            break;
            case '6':
                console.log('Saliendo del programa.');
                let contratosRemotos = sistema.getCampersTipoContr('remoto');
                let contratosPresenciales = sistema.getCampersTipoContr('presencial');
    
                console.log(`Cantidad de campers con contrato remoto: ${contratosRemotos.length}`);
                console.log(`Cantidad de campers con contrato presencial: ${contratosPresenciales.length}`);
    
                let centroMayor = sistema.getCentroMayor();
                let centroMenor = sistema.getCentroMenor();
    
                console.log(`Centro con más campers: ${centroMayor.nombre}`);
                console.log(`Centro con menos campers: ${centroMenor.nombre}`);
    
                process.exit(0);
            default:
                console.log('Opción no válida.');
        }
}