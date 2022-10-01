
import {useQuery} from '@apollo/client';
import ClientRow from './clientrow';
import {GET_CLIENTS} from '../queries/clientqueries'
import Spinner from './spinner';


export default function Clients() {
    const {loading,error,data} = useQuery(GET_CLIENTS)
    if (loading) return <Spinner/>
    if (error) return <p>something went wrong...</p>
    console.log(data);
    return (

        <div>
            {!loading && !error && (
                <table className='table table-hover mt-3'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.clients.map(client => {
                           return  <ClientRow key={client.id} client={client}/>
                        })}
                    </tbody>
                </table>
            )}
        </div>
    )

}