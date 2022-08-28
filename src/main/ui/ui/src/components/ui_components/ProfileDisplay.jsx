import React from "react";
import defaultPicture from '../../resources/default_pp.png';

const ProfileDisplay = ({ displayName, title, profilePicture, userId, permissionLevel, onClick, style }) => {

    const roleText = (permissionLevel) => {
        switch (permissionLevel) {
            case 'MOD':
                return <span title={'Moderator'}>| Mod ♕ </span>;
            case 'ADMIN':
                return <span title={'Administrator'}>| Admin ♔ </span>;
            default:
                return '';
        }
    }

    return (
        <div style={{ ...style, display: displayName ? 'flex' : 'block', maxHeight: '48px' }} onClick={ () => { onClick && onClick()} } className={ 'profile-display' }>
            <img alt={ "" } src={ profilePicture ? profilePicture : defaultPicture } style={{ width: '48px', height: '48px', borderRadius: '24px' }}/>
            { displayName &&
                <div style={{paddingLeft: '15px', position: 'relative', marginTop: title ? '-5px' : '0px'}}>
                    <h4 style={{
                        fontSize: '16px',
                        position: 'absolute',
                        top: '7px',
                        whiteSpace: 'nowrap',
                        color: 'white'
                    }}>{displayName}</h4>
                    {
                        title && <p style={{
                            position: 'absolute',
                            top: '23px',
                            fontSize: '12px',
                            color: '#ccc',
                            whiteSpace: 'nowrap',
                            lineHeight: 'initial',
                            margin: '0px'
                        }}>{ title }</p>
                    }
                    <p style={{
                        position: 'absolute',
                        top: title ? '36px' : '24px',
                        fontSize: '12px',
                        color: '#ccc',
                        whiteSpace: 'nowrap',
                        lineHeight: 'initial',
                        margin: '0px'
                    }}> {userId !== undefined && `#${userId.toString().padStart(6, '0')}`} { roleText(permissionLevel) }</p>
                </div>
            }
        </div>
    );
}


export default ProfileDisplay;