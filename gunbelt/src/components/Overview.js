import './Overview.css';
import React from 'react';
import axios from 'axios';

const API = 'http://localhost:3001/api';

class Overview extends React.Component{
    constructor( props ){
        super(props);
        this.state = {
            name: null,
            hp: null,
            maxHp: null,
            level: null,
            changeAmount: ''
        };
    }

    async getMaxHp(){
        const {characterId} = this.props;
        let reference = (await axios.get(`${API}/skill/reference`)).data;

        let toughness = reference.find( (ref) => {
            return ref.name === 'Toughness';
        })._id;

        let skills = (await axios.get(`${API}/skill/character`, {
            params:{
                characterId: characterId
            }
        })).data;

        const ranks = skills.find( (skill) => {
            return skill.skillReferenceId === toughness;
        }).ranks;

        return 32 + (ranks * 4);
    }

    async updateOverview(){
        const {characterId} = this.props;
        let result = await axios.get(`${API}/character`, {
            params:{
                character: characterId
            }
        });

        const {name, hp, level} = result.data;

        const maxHp = await this.getMaxHp();

        this.setState({name:name, hp:hp, level:level, maxHp:maxHp});
    }

    handleChange(event){
        this.setState({
            changeAmount: event.target.value
        });
    }

    buttonPress(mult){
        const {hp, maxHp, changeAmount} = this.state;
        const {characterId} = this.props;
        let amountToChange = changeAmount * mult;
        if (hp + amountToChange > maxHp){
            amountToChange = maxHp - hp;
        }
        axios.patch(`${API}/character`, {hp: hp + amountToChange}, {params:{character: characterId}});
        this.setState({
            changeAmount: '',
            hp: hp + amountToChange
        });
    }

    componentDidMount(){
        this.updateOverview();
    }

    componentDidUpdate(prevProps){
        if (prevProps.characterId !== this.props.characterId){
            this.updateOverview();
        }
    }

    render(){
        const {name, hp, maxHp, level, changeAmount} = this.state;
        return (
            <div className='Overview'>
                <div className='Overview-header'>
                    <p className='Overview-left'>{name}</p>
                    <p className='Overview-neutal'>{level}</p>
                </div>
                <div className='Overview-health'>
                    <p className='Overview-left'>{hp}</p>
                    <p className='Overview-right'>{maxHp}</p>
                </div>
                <div className='Overview-adjust'>
                    <div><button onClick={() => this.buttonPress(-1)}>harm</button></div>
                    <div><input type='number' value={changeAmount} onChange={(e) => this.handleChange(e)} className='Overview-input'></input></div>
                    <div><button onClick={() => this.buttonPress(1)}>heal</button></div>
                </div>
            </div>
        )
    }
}

export default Overview;