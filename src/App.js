import React, { Component } from 'react';
const moment = require('moment');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time_interval: 0,
      intervalId: null,
      user_token_id: null,
      account_address: null,
      item_limit: 20,
      isRunning: false
    };
  }
  componentDidMount() {
    let requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch('/api/initial', requestOptions)
      .then(response => response.json())
      .then(state => {
        console.log(state);
        const time_interval = state.time_interval;
        const user_token_id = state.user_token_id;
        const account_address = state.account_address;
        // store intervalId in the state so it can be accessed later:
        this.setState({
          intervalId: null,
          time_interval: time_interval,
          user_token_id: user_token_id,
          account_address: account_address,
          isRunning: false
        });
      });
  }
 
  componentWillUnmount() {
      // use intervalId from the state to clear the interval
      clearInterval(this.state.intervalId);
  }
  shouldComponentUpdate(nextProps, nextState){
    if (this.state.isRunning !== nextState.isRunning) {
      if(nextState.isRunning){
        const intervalId = setInterval(this.timer, this.state.time_interval);
        this.setState({isRunning: true, intervalId: intervalId});
      }else{
        clearInterval(this.state.intervalId);
        this.setState({isRunning: false, intervalId: null})
      }
    }
    return true
  }
 
  timer = () => {

      const lastSaleTime = moment().startOf('seconds').subtract(this.state.time_interval / 1000, "seconds").unix();
      let params = '';
      params += 'offset=0'
      params += '&only_opensea=true'
      this.state.user_token_id.trim() && (params += ('&token_id=' + this.state.user_token_id))
      this.state.account_address.trim() && (params += ('&account_address=' + this.state.account_address))
      params += ('&limit=' + this.state.item_limit)
      params += ('&occurred_after=' + lastSaleTime)
      const url = 'https://api.opensea.io/api/v1/events?' + params;
      const options = {method: 'GET', headers: {Accept: 'application/json'}};
      fetch(url, options)
      .then(res => res.json())
      .then(res_json => {
        let results = [];
        res_json.asset_events.forEach(ele => {
          if(ele.event_type === 'successful' || ele.event_type === 'transfer' || ele.event_type === 'created'){
            let one_result = {};
            try {
              one_result.user_name = ele.asset.owner.user.username;
            } catch (error) {
              one_result.user_name = null;
            }
            one_result.event_type = ele.event_type;
            one_result.nft_name = ele.asset.asset_contract.name ? ele.asset.asset_contract.name : '';
            one_result.price = (ele.payment_token.eth_price ? ele.payment_token.eth_price : '') + "/" + (ele.payment_token.usd_price ? ele.payment_token.usd_price : '');
            one_result.url = ele.asset.image_url ? ele.asset.image_url : '';
            results.push(one_result);
          }
        });
        console.log(results);
        if(results.length > 0){
          const requestOptions = {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }),
            body: JSON.stringify(results)
          };
          fetch('/api/send', requestOptions)
            .then(response => response.json())
            .then(state => {
              console.log(state);
            });
        }
      })
      .catch(err => console.error('error:' + err));
  }
  startBtnClicked = () => {
    if(!this.state.isRunning)
      this.timer();
    this.setState({isRunning: !this.state.isRunning});
  }
  timeIntervalChange = (e) => {
    this.setState({time_interval: e.target.value});
  }
  userTokenChanged = (e) => {
    this.setState({user_token_id: e.target.value});
  }
  accountAddressChange = (e) => {
    this.setState({account_address: e.target.value});
  }
  itemLimitChanged = (e) => {
    this.setState({item_limit: e.target.value});
  }

  render() {
    
    return (
        <div>
            <div>
                <span>User Token</span>
                <input type='text' placeholder='please input User token' defaultValue={ this.state.user_token_id } onChange={this.userTokenChanged} />
            </div>
            <div>
                <span>Account Addres</span>
                <input type='text' placeholder='please input Account Address' defaultValue={ this.state.account_address } onChange={this.accountAddressChange} />
            </div>
            <div>
                <span>Item Limit</span>
                <input type='number' min='0' max='300' defaultValue={ this.state.item_limit } onChange={this.itemLimitChanged} required />
            </div>
            <div>
                <span>Time Interval(miliseconds)</span>
                <input type='number' min='0' max='10000000' defaultValue={ this.state.time_interval } onChange={this.timeIntervalChange} required />
            </div>
            <div>
                <button onClick={this.startBtnClicked}>{this.state.isRunning ? 'Stop' : 'Start'}</button>
            </div>
        </div>
    )
  }
}

export default App;
