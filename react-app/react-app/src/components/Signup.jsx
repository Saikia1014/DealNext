import { data, Link } from "react-router-dom";
import Header from "./Header";
import { useState } from "react";
import axios from "axios";


function Signup() {

    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [mobile, setmobile] = useState('');
    const [email, setemail] = useState('');


    const handleApi = () => {
        // console.log({ username, password })
        const url = 'http://localhost:4000/signup';
        const data = { username, password, mobile, email };
        axios.post(url, data)
            .then((res) => {
                // console.log(res.data);
                if (res.data.message) {
                    alert(res.data.message);
                }
            })
            .catch((err) => {
                // console.log(err);
                alert('Server Err')
            })
    }
    return (
        <div >
            <Header />
            <div className="p-3">
                <h3>welcome to Signup Page</h3>
                <br></br>
                USERNAME
                <input className="form-control" type="text" value={username}
                    onChange={(e) => {
                        setusername(e.target.value);

                    }}></input>
                <br />
                PHONE No.
                <input className="form-control" type="text" value={mobile}
                    onChange={(e) => {
                        setmobile(e.target.value);

                    }}></input>
                <br />
                EMAIL
                <input className="form-control" type="text" value={email}
                    onChange={(e) => {
                        setemail(e.target.value);

                    }}></input>
                <br />
                PASSWORD
                <input className="form-control" type="text" value={password}
                    onChange={(e) => {
                        setpassword(e.target.value);

                    }}></input>
                <br />
                <button className="btn btn-primary m-3" onClick={handleApi}> Signup </button>
                <Link className="m-3" to="/login"> LOGIN </Link>
            </div>
        </div>
    )
}

export default Signup;