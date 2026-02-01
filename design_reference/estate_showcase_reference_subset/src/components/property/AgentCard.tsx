import { PropertyAgent } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AgentCardProps {
  agent: PropertyAgent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={agent.avatar} alt={agent.name} />
            <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-foreground">{agent.name}</h4>
            <p className="text-sm text-muted-foreground">{agent.title}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href={`tel:${agent.phone}`}>
              <Phone className="w-4 h-4 mr-2" />
              {agent.phone}
            </a>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href={`mailto:${agent.email}`}>
              <Mail className="w-4 h-4 mr-2" />
              Email Agent
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
