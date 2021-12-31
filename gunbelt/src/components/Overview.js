import './Overview.css';
import React from 'react';
import axios from 'axios';

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
        let reference = (await axios.get(`api/skill/reference`)).data;

        let toughness = reference.find( (ref) => {
            return ref.name === 'Toughness';
        })._id;

        let skills = (await axios.get(`api/skill/character`, {
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
        let result = await axios.get(`api/character`, {
            params:{
                character: characterId
            }
        });

        let {name, hp, level} = result.data;

        const maxHp = await this.getMaxHp();
        if (hp > maxHp){
            await axios.patch('api/character', {hp: maxHp}, {params:{character: characterId}});
            hp = maxHp
        }

        this.setState({name:name, hp:hp, level:level, maxHp:maxHp});
    }

    handleChange(event){
        this.setState({
            changeAmount: event.target.value
        });
    }

    async changeHealth(mult){
        const {hp, maxHp, changeAmount} = this.state;
        const {characterId} = this.props;
        let amountToChange = changeAmount * mult;
        if (hp + amountToChange > maxHp){
            amountToChange = maxHp - hp;
        }
        let response = await axios.patch(`api/character`, {hp: hp + amountToChange}, {params:{character: characterId}})
        this.setState({
            changeAmount: '',
            hp: response.data.hp
        });
    }

    async changeLevel( amount ){
        const {level} = this.state;
        if (level + amount <= 0){
            amount = 1 - level
        } else if (level + amount > 20){
            amount = level - 20
        }
        const {characterId} = this.props;
        const response = await axios.patch(`api/character`, {level: level + amount}, {params:{character: characterId}});

        this.setState({
            level: response.data.level
        });

        this.props.onUpdate();
    }

    componentDidMount(){
        this.updateOverview();
    }

    componentDidUpdate(prevProps){
        if (prevProps.characterId !== this.props.characterId || this.props.skillsUpdated){
            this.props.skillsUpdated = false;
            this.updateOverview();
        }
    }

    getLevel(){
        const {level} = this.state;
        const {editMode} = this.props;
        const levelP = <p className='Overview-neutal'>{level}</p>;
        if (editMode){
            return (
                <>
                    <button onClick={() => this.changeLevel(-1)}>-</button>
                    {levelP}
                    <button onClick={() => this.changeLevel(1)}>+</button>
                </>
            )
        }
        return levelP
    }

    render(){
        const {name, hp, maxHp, level, changeAmount} = this.state;
        return (
            <div className='Overview'>
                <div className='Overview-header'>
                    <p className='Overview-left'>{name}</p>
                    {this.getLevel()}
                </div>
                <div className='Overview-health'>
                    <p className='Overview-left'>{hp}</p>
                    <p className='Overview-right'>{maxHp}</p>
                </div>
                <div className='Overview-adjust'>
                    <div><button onClick={() => this.changeHealth(-1)}>harm</button></div>
                    <div><input type='number' value={changeAmount} onChange={(e) => this.handleChange(e)} className='Overview-input'></input></div>
                    <div><button onClick={() => this.changeHealth(1)}>heal</button></div>
                </div>
            </div>
        )
    }
}

export default Overview;