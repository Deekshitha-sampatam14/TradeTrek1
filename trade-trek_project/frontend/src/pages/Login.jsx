import React,{useState} from 'react';
import { Navigate } from 'react-router-dom';


const Login=()=>{


    const [formData,setFormData ]= useState({
        email:'',
        password:''
    })
    const [userType, setUserType] = useState(""); 
    const [rdata,setRdata]=useState("");

    const [errors,setErrors] =useState('')

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [profilePic,setProfilePic]=useState('');

    const validate=()=>{

        const formErrors={};

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!formData.email.trim())
            formErrors.email='Email is required';
        else if(!emailPattern.test(formData.email))
            formErrors.email='Invalid Email Format';

        if(!formData.password.trim())
            formErrors.password='Password is required';
        else if(formData.password.length<6)
            formErrors.password='Password must be atleast 6 characters';

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;

    }

    const handleChange=(e)=>{
            const {name,value} = e.target;
            setFormData((prevState)=>({
                ...prevState,
                [name]:value,
            }));
    }

    const handleLogin = async (e) => {
      e.preventDefault();
      if (!validate()) return;
      setLoading(true);
      try {
        const baseUrl = process.env.NODE_ENV === "production"
  ? "https://tradetrek.onrender.com"
  : "http://localhost:5000";
  
        const response = await fetch('${baseUrl}/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
    
        if (!response.ok) {
          const errorMessage = await response.text(); // Read raw text if JSON fails
          throw new Error(errorMessage || 'Login failed');
        }
    
        const data = await response.json();
        setRdata(data.find_data);
          setProfilePic(data.profileImage)
        
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.find_data._id);
          localStorage.setItem('username',data.find_data.firstName + ' ' + data.find_data.lastName);
          setSuccess(true);
        } else {
          setError('Login failed. Please try again.');
          setSuccess(false);
        }
        
        
      if (data.userType) 
      
        setUserType(data.userType);
        setSuccess(true);
      
  }  catch (err) {
        console.error('Error:', err);
        setError('An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    return(
        <div>
              <div className="container mx-auto py-16 px-4 md:px-8 lg:px-16">
      <h2 className="text-center my-10 text-3xl font-extrabold text-gray-700 sm:text-4xl lg:text-5xl">
        Login
      </h2>
      {success && userType ?(
       userType === 'tradesperson' ? (

        <Navigate to="/tradespersondash" state={{ rdata: rdata || {}, profilePic: profilePic || "" }} />


      ) : (
        <Navigate to="/userdash" state={{ rdata: rdata || {}, profilePic: profilePic || "" }} />

      )
        
      ) : (
      <form onSubmit={handleLogin} className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
            <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-4 border border-gray-300 rounded-lg focus:border-gray-600 w-full text-center"
            />
            {errors.email&&<p className='text-red-500 text-sm'>{errors.email}</p>}
        </div>
            <div>
                <input
                type='password'
                name='password'
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
                 className="p-4 border border-gray-300 rounded-lg focus:border-gray-600 w-full text-center"/>
              {errors.password &&<p className='text-red-500 text-sm'>{errors.password}</p>}
              
            </div>
            </div>
            <button
          type="submit"
          className="w-full py-3 px-6 bg-[#98C379] text-white font-semibold rounded-lg hover:bg-[#3A506B] focus:outline-none"
        >
           {loading ? 'Login...' : 'Login'}
        </button>
        {error&&<p className='text-red-500'>{error}</p>}
        
      </form>
      )}
            
            </div>

        </div>
    )
}

export default Login;