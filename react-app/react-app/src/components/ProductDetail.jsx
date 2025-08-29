import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";


function ProductDetail() {

    const [product, setproduct] = useState()
    const [user, setuser] = useState()
    console.log(user);
    const p = useParams()
    // console.log(p.productId)

    useEffect(() => {
        const url = 'http://localhost:4000/get-product/' + p.productId;
        axios.get(url)
            .then((res) => {
                if (res.data.product) {
                    setproduct(res.data.product)
                }
            })
            .catch((err) => {
                alert('server err')
            })
    }, [])

    const handleContact = (addedBy) => {
        console.log('id', addedBy);
        const url = 'http://localhost:4000/get-user/' + addedBy;
        axios.get(url)
            .then((res) => {
                if (res.data.user) {
                    setuser(res.data.user)
                }
            })
            .catch((err) => {
                alert('server err')
            })
    }

    return (<>
        <div>
            <Header />
            PRODUCT DETAILS
            {product && <div className="d-flex justify-content-between flex wrap">
                <div >
                    <img width="400px" className="m-2" height="250px" src={'http://localhost:4000/' + product.pimg} alt="" />
                    {product.pimg2 && 
                    <img width="400px" className="m-2" height="250px" src={'http://localhost:4000/' + product.pimg2} alt="" />}
                    <h6>Product Details: </h6>
                    {product.pdesc}
                </div>
                <div>
                    <h3 className="m-2 price-text"> Rs. {product.price} /-</h3>
                    <p className="m-2">{product.pname} | {product.category}</p>
                    <p className="m-2 text-success">{product.pdesc}</p>

                    {product.addedBy &&
                        <button className="btn btn-primary" onClick={() => handleContact(product.addedBy)}>
                            Contact Seller</button>}

                    {user && user.username && <h4>{user.username}</h4>}        
                    {user && user.mobile && <h3>{user.mobile}</h3>}        
                    {user && user.email && <h6>{user.email}</h6>}        

                </div>
            </div>
            }
        </div>
    </>
    )
}

export default ProductDetail;