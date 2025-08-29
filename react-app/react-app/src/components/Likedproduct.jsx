import { useEffect, useState } from "react";
import Header from "./Header";
import { data, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";
import { FaHeart } from 'react-icons/fa';
import './Home.css'



function Likeproduct() {

    const navigator = useNavigate()

    const [products, setproducts] = useState([]);
    const [cproducts, setcproducts] = useState([]);
    const [search, setsearch] = useState('');
    // const [cat, setcat] = useState('');
    // useEffect(() => {
    //     if (!localStorage.getItem('token')) {
    //         navigator('/login')
    //     }
    // }, [])

    useEffect(() => {
        const url = 'http://localhost:4000/liked-products';
        let data = { userId: localStorage.getItem('userId')}
        axios.post(url, data)
            .then((res) => {
                if (res.data.products) {
                    setproducts(res.data.products);
                }
            })
            .catch((err) => {
                alert('server err')
            })
    }, [])

    const handlesearch = (value) => {
        setsearch(value);
    }
    const handleClick = () => {
       
        let filteredProducts = products.filter((item) => {
            console.log(item)
            if (item.pname.toLowerCase().includes(search.toLowerCase()) ||
                item.pdesc.toLowerCase().includes(search.toLowerCase()) ||
                item.category.toLowerCase().includes(search.toLowerCase())) {
                return item;
            }
        })
        setcproducts(filteredProducts)
    }

    const handleCategory = (value) => {
        // setcat(value);
        let filteredProducts = products.filter((item, index) => {
            console.log(value, item, "v")
            if (item.category == value) {
                return item;
            }
        })
        setcproducts(filteredProducts)

    }

    const handleLike = (productId)=>{
        let userId= localStorage.getItem('userId')
        // console.log('userId', 'productId', productId, userId);

        const url = 'http://localhost:4000/like-product';
        const data = {userId,productId}
        axios.post(url,data)
            .then((res) => {
                // if (res.data.products) {
                //     setproducts(res.data.products);
                // }/
                console.log(res);
                if(res.data.message) {
                    alert('Liked')
                }
            })
            .catch((err) => {
                alert('server err')
            })
    }

    return (
        <div>

            <Header search={search} handlesearch={handlesearch} handleClick={handleClick} />
            <Categories handleCategory={handleCategory} />
            {/* {!!localStorage.getItem('token') && <Link to="/add-product"> <button className="logout-btn">ADD PRODUCT </button></Link>} */}

            <h5>SEARCH RESULTS</h5>
            <div className="d-flex justify-content-center flex-wrap">
                {cproducts && products.length > 0 &&
                    cproducts.map((item, index) => {
                        return (
                            <div key={item._id} className="card m-3">
                                <div onClick={()=> handleLike(item._id)} className="icon-con">
                                    <FaHeart className="icons" />
                                </div>
                                <img width="300px" height="200px" src={'http://localhost:4000/' + item.pimg} />
                                <p className="p-2">{item.pname} | {item.category}</p>
                                <p className="p-2 text-success">{item.pdesc}</p>
                                <h3 className="p-2 text-success">{item.price}</h3>

                            </div>
                        )
                    })}
            </div>

            <h5>ALL RESULTS</h5>
            <div className="d-flex justify-content-center flex-wrap">
                {products && products.length > 0 &&
                    products.map((item, index) => {
                        return (
                            <div key={item._id} className="card m-3">
                                <div onClick={()=> handleLike(item._id)} className="icon-con">
                                    <FaHeart className="icons" />

                                    {/* <FaHeart style={{ color: 'red', fontSize: '30px' }} /> */}
                                </div>

                                <img width="300px" height="200px" src={'http://localhost:4000/' + item.pimg} />
                                <p className="p-2">{item.pname} | {item.category}</p>
                                <p className="p-2 text-success">{item.pdesc}</p>
                                <h3 className="p-2 text-success">{item.price}</h3>

                            </div>
                        )
                    })}
            </div>


        </div>
    )
}

export default Likeproduct;