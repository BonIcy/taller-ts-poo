"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const readlineSync = __importStar(require("readline-sync"));
class Centro {
    nombre;
    constructor(nombre) {
        this.nombre = nombre;
    }
}
class Ruta {
    nombre;
    centro;
    constructor(nombre, centro) {
        this.nombre = nombre;
        this.centro = centro;
    }
}
class Nivel {
    nombre;
    ruta;
    constructor(nombre, ruta) {
        this.nombre = nombre;
        this.ruta = ruta;
    }
}
class Camper {
    nombre;
    constructor(nombre) {
        this.nombre = nombre;
    }
}
class Contrato {
    camper;
    nivel;
    constructor(camper, nivel) {
        this.camper = camper;
        this.nivel = nivel;
    }
}
class SistemaGestion {
    centros = new Map();
    rutas = new Map();
    niveles = new Map();
    campers = new Map();
    contratos = [];
    registrarCentro() {
        let nombre = readlineSync.question('Ingrese el nombre del centro: ');
        let centro = new Centro(nombre);
        this.centros.set(nombre, centro);
        return centro;
    }
    registrarRuta(centro) {
        let nombre = readlineSync.question('Ingrese el nombre de la ruta: ');
        let ruta = new Ruta(nombre, centro);
        this.rutas.set(nombre, ruta);
        return ruta;
    }
    registrarNivel(ruta) {
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
        let camper = this.campers.get(camperNombre);
        let nivel = this.niveles.get(nivelNombre);
        if (!camper || !nivel) {
            console.log('Camper o nivel no encontrados.');
            return;
        }
        let contrato = new Contrato(camper, nivel);
        this.contratos.push(contrato);
        return contrato;
    }
    getCampersNvl(nivel) {
        return this.contratos
            .filter(contrato => contrato.nivel === nivel)
            .map(contrato => contrato.camper);
    }
    getCampersTipoContr(tipo) {
        let centroKey = tipo === 'remoto' ? 'Centro A' : 'Centro B';
        let centro = this.centros.get(centroKey);
        if (!centro) {
            return [];
        }
        return this.contratos
            .filter(contrato => contrato.nivel.ruta.centro === centro)
            .map(contrato => contrato.camper);
    }
    getCentroMayor() {
        let centroMap = new Map();
        for (let contrato of this.contratos) {
            let centro = contrato.nivel.ruta.centro;
            centroMap.set(centro, (centroMap.get(centro) || 0) + 1);
        }
        let [centroMayor] = [...centroMap.entries()].reduce((max, entry) => entry[1] > max[1] ? entry : max);
        return centroMayor;
    }
    getCentroMenor() {
        let centroMap = new Map();
        for (let contrato of this.contratos) {
            let centro = contrato.nivel.ruta.centro;
            centroMap.set(centro, (centroMap.get(centro) || 0) + 1);
        }
        let [centroMenor] = [...centroMap.entries()].reduce((min, entry) => entry[1] < min[1] ? entry : min);
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
            }
            else {
                sistema.registrarRuta(centro);
            }
            break;
        case '3':
            let rutaNombre = readlineSync.question('Ingrese el nombre de la ruta: ');
            let ruta = sistema.rutas.get(rutaNombre);
            if (!ruta) {
                console.log('Ruta no encontrada.');
            }
            else {
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
            process.exit(0);
        default:
            console.log('Opción no válida.');
    }
}
