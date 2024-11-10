import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import GradientCircularProgress from './GradientCircularProgress';
import MyAvatar from '../components/MyAvatar';


function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{  }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`,
	};
}

export default function FullWidthTabs(props) {
	const theme = useTheme();
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
		props.setSearchFilter((value == 1) ? "displayName" : "email");
	};

	const handleChangeIndex = (index) => {
		setValue(index);
	};

	return (
		<Box sx={{ bgcolor: 'inherit', width: '100%' }}>
			<AppBar position="static">
				<Tabs
					value={value}
					onChange={handleChange}
					textColor='inherit'
					variant="fullWidth"
					aria-label="full width tabs example"
					sx={{ bgcolor: '#1f7474' }}
					TabIndicatorProps={{style: {background:'#c13434'}}}
				>
					<Tab label="Display Name" {...a11yProps(0)} />
					<Tab label="Email" {...a11yProps(1)} />
				</Tabs>
			</AppBar>
			<SwipeableViews
				axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
				index={value}
				onChangeIndex={handleChangeIndex}
			>
				<TabPanel  
					value={value} 
					index={0} 
					dir={theme.direction}
				>
					{(props.isLoading) ?
						<div className='w-full p-2'>
							<GradientCircularProgress />
						</div> : 
						<>
							{(props.searchResults.length != 0) && props.searchResults.map((result, i) => (
							<div key={i} onClick={() => props.handleResultClick(i)} className="resultItem max-h-[56px] flex flex-row p-2 gap-x-2 border-b-solid border-b-black border-b-2 overflow-hidden cursor-pointer">
								<MyAvatar src={result.photoURL} width={'40px'} height={'40px'} />
								<div className="info flex flex-col items-start justify-center">
									<span className="font-bold text-lg text-left">{result.displayName}</span>
									<p className="text-xs text-left">{result.email}</p>
								</div>
							</div>
							))}
							{(props.isErr) && <div className='p-2'>{props.errMsg}</div>}
						</>
					}
					
				</TabPanel>
				<TabPanel  
					value={value} 
					index={1} 
					dir={theme.direction}
				>
					{(props.searchResults.length != 0) && props.searchResults.map((result, i) => (
						<div key={i} onClick={() => props.handleResultClick(i)} className="resultItem max-h-[56px] flex flex-row p-2 gap-x-2 border-b-solid border-b-black border-b-2 overflow-hidden cursor-pointer">
							<MyAvatar src={result.photoURL} width={'40px'} height={'40px'} />
							<div className="info flex flex-col items-start justify-center">
								<span className="font-bold text-lg text-left">{result.displayName}</span>
								<p className="text-xs text-left">{result.email}</p>
							</div>
						</div>
					))}
					{(props.isErr) && <div className='p-2'>{props.errMsg}</div>}
				</TabPanel>
			</SwipeableViews>
		</Box>
	);
}