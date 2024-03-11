import { IMenuItem } from "@/components/globalMenu"
export const MENU_LIST: IMenuItem[] = [
    {
        name: 'inicio',
        url: '/'
    },
    {
        name: 'especialidades',
        url: '/#especialidades'
    }, 
    {
        name: 'escolares',
        url: '#escolares',
        submenu: [
           {
            name:'inscripciones',
            url:'#inscripciones',
            submenu:[{
                name:'documentacion requerida',
                url:'/documentacion-requerida'
            }, {
                name:'solicitud de inscripciones',
                url:'/solicitud-inscripciones'
            }, {
                name:'carta compromiso',
                url:'/carta-compromiso'
            }]
           },
           {
            name:'reglamento',
            url:'/reglamento',
           },
           {
            name:'control de alumnos',
            url:'/control-alumnos',
           },{
            name: 'proyectos',
            url:'/proyectos'
           }
        ]

    },
    {
        name: 'docentes',
        url: '/docentes',
        submenu:[{
            name: "planeacion didactica",
            url:'/planeacion'
        }, {
            name:"pronafole",
            url:'/pronafole'
        }]
    },
    {
        name:'administracion',
        url:'#',
        submenu:[{
            name: "Autoservicios (SEMS)",
            url: '#'
        }, {
            name:'SDPC',
            url: '#'
        }]
    },
    {
        name: 'vinculacion',
        url: '/vinculacion',
        submenu:[{
            name:'Prototipos',
            url: '/prototipos'
        }, {
            name: 'Practicas Profesionales',
            url: '/practicas'
        },{
            name: 'Bolsa de trabajo',
            url: '/bolsa'
        }, {
            name:'Cedula profesional Electronica', 
            url: '/cedula'
        }]
    }, {
        name: 'contacto',
        url:'/#contacto'
    }
]