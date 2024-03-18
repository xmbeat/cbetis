import { ReactNode } from "react"
import styles from './styles.module.scss'
import  PressEffect from "../PressEffect"
interface IButtonProps{
    children?: ReactNode,
    className?: string,
    icon?: ReactNode,
    href?:string
}
function Wrapper({anchor, elementProps, children }:{anchor:boolean, elementProps:any, children?:ReactNode}){
    return anchor?<a {...elementProps} >{children}</a>:<button {...elementProps}>{children}</button>
}
export default function Button({children, className, icon, href}:IButtonProps) {
    return <>
       {<Wrapper anchor={href!=null} elementProps={{className:`${styles.button} ${className??''}`}}>
            <PressEffect/>
            {children}
        </Wrapper>}
    </>
} 