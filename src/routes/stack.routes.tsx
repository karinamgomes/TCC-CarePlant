import React from 'react';
import  { createStackNavigator } from '@react-navigation/stack';

import { Welcome } from '../pages/Welcome';
import { UserIdentification } from '../pages/UserIdentification';
import { Confirmation } from '../pages/Confirmation';
import { PlantSave } from '../pages/PlantSave';
import { MyPlants } from '../pages/MyPlants';

import colors from '../styles/colors';
import AuthRoutes from './tab.routes';
import { PlantSelect } from '../pages/PlantSelect';
import { PlantStatus } from '../pages/PlantStatus';

const stackRoutes = createStackNavigator();

const AppRoutes: React.FC = () => (
    <stackRoutes.Navigator
        // headerMode="none"
        screenOptions={{
            title:'',
            headerShown:false,
            cardStyle: {
                backgroundColor: colors.white
            },
            headerStyle:{ 
                elevation: 0,
                backgroundColor: 'transparent',
                shadowOpacity:0,
            }

        }}
    >
        <stackRoutes.Screen 
            name="Welcome"
            component={Welcome}
            
        />

        <stackRoutes.Screen 
            name="UserIdentification"
            component={UserIdentification}
        />

        <stackRoutes.Screen 
            name="Confirmation"
            component={Confirmation}
        />

        {/* <stackRoutes.Screen 
            name="PlantSelect"
            component={AuthRoutes}
        /> */}
        <stackRoutes.Screen 
            name="PlantSelect"
            component={PlantSelect}
        />

        <stackRoutes.Screen 
            name="PlantStatus"
            component={PlantStatus}
        />

        <stackRoutes.Screen 
            name="MyPlants"
            component={MyPlants}
        />

        <stackRoutes.Screen 
            name="PlantSave"
            component={PlantSave}
        />

        {/* <stackRoutes.Screen 
            name="MyPlants"
            component={AuthRoutes}
        /> */}

    </stackRoutes.Navigator>
)


export default AppRoutes;