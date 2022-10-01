import {FaTrash} from 'react-icons/fa';
import {useMutation} from '@apollo/client';
import { DELETE_CLIENT } from '../mutation/clientmutation';
import { GET_CLIENTS } from '../queries/clientqueries';

export default function ClientRow(client) {
    console.log(client);
    const [deleteClient] = useMutation(DELETE_CLIENT, {
        variables: { id: client.client.id },
        update(cache, {data : {deleteClient}}) {
        const {clients} = cache.readQuery({
            query: GET_CLIENTS
        });
        cache.writeQuery({
            query : GET_CLIENTS ,
            data : {clients: clients.filter(client => client.id !== deleteClient.id)}
        });
       }
    });
    return (
        <>
            <tr>
                <td >{client.client.id}</td>
                <td >{client.client.name}</td>
                <td >{client.client.phone}</td>
                <td >{client.client.email}</td>
                <td>
                    <button className="btn btn-danger btn-sm" onClick={deleteClient}>
                        <FaTrash/>
                    </button>
                </td>
            </tr>
        </>
    )

}