import io from 'socket.io-client'
import HeadsUp from './HeadsUp/HeadsUp'

export default class Socket
{

    constructor()
    {
        this._socket = io(process.env.ORIGIN || 'https://localhost:3000')
        this._socket.on('connect', () => {
            this._socket.on('serverMessage', msg => {
                new HeadsUp('serverMessage', msg)
            })

            this._socket.on('initApp', appContent => {
                appContent.map(list => this.organiseListItems(list))
                this._appContent = appContent
            })

            this._socket.on('updateApp', updatedContent => {
                updatedContent.map(list => this.organiseListItems(list))
                this._appContent = updatedContent
            })
        })


        this._socket.on('error', () => {
            new HeadsUp('serverMessage', 'Er is iets fout gegaan in de verbinding met de server, probeer de pagina te herladen.')
        })
    }

    /**
     * Parse URL parameters
     */
    params()
    {
        if (window.location.search) {
            let params = window.location.search,
                paramsObject = {}
            
            params = params.slice(1)

            // const commaTest = new RegExp(/(,{1})/)
            const equalsTest = new RegExp(/(={1})/)
            const amperSandTest = new RegExp(/(&{1})/)

            params = amperSandTest[Symbol.split](params)

            for (let param of params)
                if (amperSandTest.test(param))
                    params.splice(params.indexOf(param), 1)

            for (let param of params) {
                param = equalsTest[Symbol.split](param)
                let paramName = param[0]
                let paramValue = param[2]
                paramsObject[paramName] = paramValue
            }

            params = paramsObject
            return params
        } else
            return null
    }

    organiseListItems(list) {
        switch (list.flow) {
            default: {
                return list
            }

            case 'reverse': {
                list.listItems.reverse()
                return list
            }

            case 'sort': {
                list.listItems.sort((a, b) => b.title.toUpperCase() < a.title.toUpperCase())
                return list
            }
        }
    }

}