import React from "react";
import defaultPicture from '../../resources/default_pp.png';

const ProfileDisplay = ({ displayName, profilePicture, userId, permissionLevel, onClick, style }) => {

    return (
        <div style={{ ...style, display: displayName ? 'flex' : 'block', maxHeight: '48px' }} onClick={ () => { onClick && onClick()} }>
            <img alt={ "" } src={ profilePicture ? profilePicture : defaultPicture } style={{ width: '48px', height: '48px', borderRadius: '24px' }}/>
            { displayName &&
                <div style={{paddingLeft: '15px', position: 'relative'}}>
                    <h4 style={{
                        fontSize: '16px',
                        position: 'absolute',
                        top: '7px',
                        whiteSpace: 'nowrap',
                        color: 'white'
                    }}>{displayName}</h4>
                    <p style={{
                        position: 'absolute',
                        top: '24px',
                        fontSize: '12px',
                        color: '#ccc',
                        whiteSpace: 'nowrap',
                        lineHeight: 'initial'
                    }}> {userId !== undefined && `#${userId.toString().padStart(6, '0')}`} { permissionLevel && permissionLevel !== 'BASIC' && `(${permissionLevel})`}</p>
                </div>
            }
        </div>
    );
}

export default ProfileDisplay;