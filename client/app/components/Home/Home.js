import React, { Component } from 'react';
import 'whatwg-fetch';
import { getFromStorage, setInStorage } from '../../utils/storage';


class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '', //if theres a token, which means the user is signed in 
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpEmail: '',
      signUpPassword: '',
      
    };
    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this);
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);

    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);

  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app');
    console.log(obj)
    if (obj && obj.token) {
      const { token } = obj;
      //verifyt toke
      fetch('api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: token,
              isLoading: false
            });
          }
          else {
            this.setState({
              isLoading: false,
            })
          }
        })
    }
    else {
      this.setState({
        isLoading: false,
      })
    }
  }

  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value,
    })
  }

  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value,
    })
  }

  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value,
    })
  }

  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value,
    })
  }

  onTextboxChangeSignUpFirstName(event) {
    this.setState({
      signUpFirstName: event.target.value,
    })
  }

  onTextboxChangeSignUpLastName(event) {
    this.setState({
      signUpLastName: event.target.value,
    })
  }

  onSignIn() {

    //grab state]
    const {
      signInEmail,
      signInPassword,
      signInError,

    } = this.state;

    this.setState({
      isLoading: false,
    })
    // post requst to backend 

    fetch('/api/account/signin', {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    })
      .then(res => res.json ())
      .then(json =>{
        if(json.success){
          setInStorage('the_main_app',{token:json.token});
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInEmail: '',
            signInPassword: '',
            token: json.token,
          });
        }
        else{
          this.setState({
            signUpError: json.message,
            isLoading: false,
          });
        }
      });


  }

  onSignUp() {
    //grab state]
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    })
    // post requst to backend 

    fetch('/api/account/signup', {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        firstName : signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword,
      }),
    })
      .then(res => res.json())
      .then(json =>{
        if(json.success){
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: '',
            signUpFirstName: '',
            signUpLastName: '',
            signUpPassword: '',
          });
        }
        else{
          this.setState({
            signUpError: json.message,
            isLoading: false,
          });
        }
      });

  }

  logout() {
    this.setState({
      isLoading:true,
    });
    const obj = getFromStorage('the_main_app');
    if (obj &&obj.token) {
      const { token } = obj;
      //verifyt toke
      fetch('api/account/logout?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: '',
              isLoading: false,
              message: 'sgasg',
            });
          }
          else{
            this.setState({
              isLoading: false,
              message: 'sgasggdsgagsa',
            })
          }
        })
    }
    else {
      this.setState({
        isLoading: false,
      })
    }
  }




  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpEmail,
      signUpFirstName,
      signUpLastName,
      signUpPassword,
      signUpError,

    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>)
    }

    if (!token) {
      return (
        // <div className="login-page"> 
        //   <div className="cities">
        //     {
        //       (signInError) ? (
        //         <p>{signInError}</p>
        //       ) : (null)
        //     }
        //     <p>Sign In</p>
            
        //     <input type="email"
        //       placeholder="Email"
        //       value={signInEmail}
        //       onChange={this.onTextboxChangeSignInEmail} /><br />
        //     <input type="password"
        //       placeholder="Password"
        //       value={signInPassword}
        //       onChange={this.onTextboxChangeSignInPassword} /><br />
        //       <br></br>
        //     <button onClick={this.onSignIn}> Sign In</button>
        //   </div>

        // </div>
        <div className="login-page">
        <div className="form">
          <form className="login-form">
            <input type="text" placeholder="username" value={signInEmail} 
            onChange={this.onTextboxChangeSignInEmail}/>
            <input type="password" placeholder="password" value={signInPassword} onChange={this.onTextboxChangeSignInPassword}/>
            <button onClick={this.onSignIn}> Sign In</button>
            <p className="message">Not registered? <a href="#">Create an account</a></p>
          </form>
        </div>
      </div>
        
      )
    }
    return (
      <div>
        <p>Account</p>
        <button onClick={this.logout}> LogOut </button>

      </div>
    );
  }
}

export default Home;