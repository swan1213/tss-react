
import { makeStyles } from "makeStyles";
import { GlobalStyles } from "tss-react";
import { styled } from "@material-ui/core";
import Button from "@material-ui/core/Button"

export type Props = {
	className?: string;
};


const useStyles = makeStyles()((theme, _params, css) => {

	const child = {
		"background": "blue",
		"border": "1px solid black"
	};

	return {
		"root": {
			"& > h1:nth-child(2)": {
				"color": theme.palette.primary.main,
			},
		},
		"ovStyled": {
			"color": "darkred"
		},
		"ovInternal": {
			"backgroundColor": "darkblue"
		},
		"parent": {
			"border": "1px solid black",
			"padding": 30,
			[`&:hover .${css(child)}`]: {
				"background": "red",
			}
		},
		child
	};
});

const H1 = styled('h1')({
	"color": "yellow"
});

export function App(props: Props) {
	const { className } = props;
	const { classes, css, cx } = useStyles();

	return (
		<>
			<GlobalStyles
				styles={{
					"body": {
						"backgroundColor": "pink"
					},
					".foo": {
						"color": "cyan"
					}
				}}
			/>
			<div className={classes.root}>
				<h1>Black</h1>
				<h1>Should be lime green</h1>
				<h1
					className={cx(
						css({ "border": "1px solid black" }),
						className
					)}
				>
					Black, should have border and shadow
				</h1>
				<h1 className="foo">Should be cyan</h1>
				<H1>Should be yellow</H1>
				<H1 className={classes.ovStyled}>Should be dark red</H1>
				<Button variant="contained" color="primary"> Background should be lime green</Button>
				<Button
					variant="contained"
					color="primary"
					className={classes.ovInternal}
				>
					Background should be dark blue
				</Button>
				<div className={classes.parent}>
					<div className={classes.child}>
						Background should turn red when mouse is hover the parent.
					</div>
				</div>
			</div>
		</>
	);
}
