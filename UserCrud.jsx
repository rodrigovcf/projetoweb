import Main from '../template/Main'
import axios from 'axios'
import { useEffect, useState } from 'react'

const baseURL = 'http://localhost:3001/users'

const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de Usuários: CRUD'
}

const initialState = { name: '', email: '' }

export default function UserCrud() {

    const [user, setUser] = useState(initialState)
    const [userList, setItems] = useState([])

    useEffect(() => {
        const getAllUsers = async () => {
            const allUsers = await retrieveUsers()
            if (allUsers) setItems(allUsers)
        }
        getAllUsers()        
    }, [])

    const retrieveUsers = async () => {
        try {
            const response = await axios.get(baseURL)
            return response.data
        } catch (err) {
            console.error(err.message)
        }        
    }

    const load = (user) => {
        setUser(user)
    }

    const remove = (userSelected) => {
        axios.delete(`${baseURL}/${userSelected.id}`).then(resp => {
            const newList = userList.filter(u => u !== userSelected)
            setItems(newList)
        })
    }

    //Adicionar e Atualizar
    const save = () => {
        if (user.name === '' || user.email === '') {
            alert('Todos os campos devem ser preenchidos!')
            return
        }

        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseURL}/${user.id}` : baseURL
        axios[method](url, user)
            .then(resp => {
                const list = getUpdateList(resp.data)
                setItems(list)
                clear()
            })
    }

    const getUpdateList = (data) => {
        const list = userList.filter((user) => user.id !== data.id)
        list.unshift(data)
        return list
    }

    const clear = () => {
        setUser(initialState)
    }

    const updateField = (event) => {
        setUser({
            ...user, [event.target.name]: event.target.value
        })
    }

    function renderTable(){
        return(
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {renderRows()}
                </tbody>
            </table>
        )
    }

    function renderRows(){
        return userList.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>                    
                    <td>
                        <button className="btn btn-warning"
                        onClick={() => load(user)}>
                            <i className="fa fa-pencil"/>
                        </button>

                        <button className="btn btn-danger ml-2"
                        onClick={() => remove(user)}>
                            <i className="fa fa-trash"/>
                        </button>
                        
                    </td>
                </tr>
            )
        })
    }

    function renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" className="form-control"
                                name="name"
                                value={user.name}
                                placeholder="Digite o nome..."
                                onChange={e => updateField(e)}
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="text" className="form-control"
                                name="email"
                                value={user.email}
                                placeholder="Digite o email..."
                                onChange={e => updateField(e)}
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => save(e)}>                            
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => clear(e)}>                            
                            Cancelar
                        </button>
                    </div>

                </div>
            </div>
        )
    }

    return (
        <Main {...headerProps}>
            {renderForm()}
            {renderTable()}
        </Main>
    )
}

