import { store } from '../../app/store'
//import { customerApiSlice } from '../customers/customerApiSlice'
//import { AdminApiSlice } from '../users/AdminApiSlice';
//import { TipsApiSlice } from '../tips/TipsApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {

    useEffect(() => {
        //store.dispatch(customerApiSlice.util.prefetch('getCustomers', 'customersList', { force: true }))
        //store.dispatch(AdminApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
        //store.dispatch(TipsApiSlice.util.prefetch('getTips', 'tipsList', { force: true }))
    }, [])

    return <Outlet />
}
export default Prefetch