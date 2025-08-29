import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import categories from "./CategoriList";

function AddProduct() {

    const navigate = useNavigate();
    const [pname, setpname] = useState('');
    const [pdesc, setpdesc] = useState('');
    const [price, setprice] = useState('');
    const [category, setcategory] = useState('');
    const [pimg, setpimg] = useState('');
    const [pimg2, setpimg2] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login')
        }
    }, [])

    const handleApi = () => {

        navigator.geolocation.getCurrentPosition((position) => {
            
            const formData = new FormData();
            formData.append('plati', position.coords.latitude)
            formData.append('plongi', position.coords.longitude)
            formData.append('pname', pname)
            formData.append('pdesc', pdesc)
            formData.append('price', price)
            formData.append('category', category)
            formData.append('pimg', pimg)
            formData.append('pimg2', pimg2)
            formData.append('userId', localStorage.getItem('userId'))

            const url = 'http://localhost:4000/add-product';
            axios.post(url, formData)
                .then((res) => {
                    if (res.data.message) {
                        alert(res.data.message);
                        navigate('/');
                    }
                })
                .catch((err) => {
                    console.log(err);
                    alert('server err')
                })

        })


    }

    return (
        <div className="p-3" >

            <Header />
            <h2>ADD PRODUCT HERE</h2>
            <label>Product Name</label>
            <input className="form-control" type="text" value={pname}
                onChange={(e) => { setpname(e.target.value) }} />
            <label>Product Description</label>
            <input className="form-control" type="text" value={pdesc}
                onChange={(e) => { setpdesc(e.target.value) }} />
            <label>Product Price</label>
            <input className="form-control" type="text" value={price}
                onChange={(e) => { setprice(e.target.value) }} />
            <label>Product Category</label>

            <select className="form-control" value={category}
                onChange={(e) => { setcategory(e.target.value) }}>
                <option>Beds</option>
                <option>Tables</option>
                <option>Cloth Hanger</option>
                {
                    categories && categories.length > 0 &&
                    categories.map((item, index) => {
                        return (
                            <option key={'option' + index}> {item}</option>
                        )
                    })
                }
            </select>
            <label>Product Image</label>
            <input className="form-control" type="file"
                onChange={(e) => {
                    setpimg(e.target.files[0])
                }} />
            <label>Product second Image</label>
            <input className="form-control" type="file"
                onChange={(e) => {
                    setpimg2(e.target.files[0])
                }} />

            <button onClick={handleApi} className="btn btn-primary mt-3" >SUBMIT</button>
        </div>
    )
}

export default AddProduct;