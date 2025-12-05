import React, { PureComponent } from 'react';
import { CBillableItemsCreate } from './components/CBillableItemsCreate';
import { SmartSelect } from './components/SmartSelect';
import { SmartInput } from './components/SmartInput';
import { SmartBox } from './components/SmartBox';
import { SmartCreatable } from './components/SmartCreatable';
import { CityOptions } from './components/CityOptions';
import { Header } from './components/Header';
import SmartCalendar from './components/SmartCalendar';

export class MasterBillableItemsCreate extends PureComponent {
  render() {
    return <div className="master" style={{backgroundColor: "rgba(255, 255, 255, 1)"}}>
      <CBillableItemsCreate {...this.props} nodeId="1:2" />
    </div>
  }
}

export function getComponentFromId(id) {
  if (id === "1:2") return CBillableItemsCreate1D2;
  return null;
}

class CBillableItemsCreate1D2 extends PureComponent {
  	render() {
    	return (
      		<div>
        		<div className='header-grid'>
          			<Header />
        		</div>
        
        
       			{/* CARD */}
        		<div style={{
          			border: "3px solid #F6DDD4",
          			padding: "40px",
          			maxWidth: 900,
          			margin: "40px 40px 40px 40px",
        		}}>
          
          			{/* FORM GRID */}
          			<div
            			className='main-grid'
            			style={{
              				display: "grid",
              				gap: "24px",
              				gridTemplateColumns: "1fr 1fr",
            			}}
          			>

            			{/* FIELD 1 */}
            			<div>
            			  	<div style={labelStyle}>Ім’я</div>
            			  	<SmartBox>
            			    	<SmartInput defaultValue="Тарас" />
            			  	</SmartBox>
            			</div>

            			{/* FIELD 2 */}
            			<div>
            			  	<div style={labelStyle}>Прізвище</div>
            			  	<SmartBox>
            			    	<SmartInput defaultValue="Шевченко" />
            			  	</SmartBox>
            			</div>

            			{/* FIELD 3 */}
            			<div>
            			  	<div style={labelStyle}>Країна</div>
            			  	<SmartBox>
            			    	<SmartSelect
            			      		options={[{ value: "ua", label: "Україна" }]}
            			      		defaultValue={{ value: "ua", label: "Україна" }}
            			    	/>
            			  	</SmartBox>
            			</div>

            			{/* FIELD 4 */}
            			<div>
            			  	<div style={labelStyle}>Місто</div>
            			  	<SmartBox>
            			    	<SmartCreatable
            			      		options={CityOptions}
            			      		defaultValue={CityOptions.find(o => o.value === "kyiv")}
            			    	/>
            			  	</SmartBox>
            			</div>

            			{/* FIELD 5 */}
            			<div>
            			  	<div style={labelStyle}>Стать</div>
            			  	<SmartBox>
            			    	<SmartSelect
            			      		options={[
            			        		{ value: "male", label: "Чоловіча" },
            			        		{ value: "female", label: "Жіноча" },
            			        		{ value: "other", label: "Інша" },
            			      		]}
            			      		defaultValue={{ value: "male", label: "Чоловіча" }}
            			    	/>
            			  	</SmartBox>
            			</div>
						<div>
							<div style={labelStyle}>День Народження</div>
							<SmartBox>
								<SmartCalendar />
							</SmartBox>
						</div>
          			</div>
        		</div>
      		</div>
    	);
  	}
}

const labelStyle = {
  marginBottom: 8,
  fontSize: 18,
  fontFamily: "Seenonim",
  color: "#000",
};

