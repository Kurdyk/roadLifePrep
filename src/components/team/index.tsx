import React from 'react'
import { COLLABORATORS } from './const'
import { Box, Card, CardContent, CardHeader, CardMedia, List, Typography } from '@mui/material'

const TeamPage: React.FC = () => {
    return (
        <Box id="TeamPageWrapper">
            <Typography variant='h3' id='TeamPageTitle'>
                L'équipe RoadLife
            </Typography>
            <List className='CollaboratorList'>
            {COLLABORATORS.map((collaborator) => {
                return (
                    <Card key={collaborator.name} className='collaboratorCard'>
                        <CardHeader 
                            title={collaborator.name}
                        />
                        <CardMedia
                            component="img"
                            image={collaborator.imgPath}
                        />
                        <CardContent>
                            {collaborator.description}
                        </CardContent>
                    </Card>
                )
            })}
            </List>
        </Box>
    )
}

export default TeamPage