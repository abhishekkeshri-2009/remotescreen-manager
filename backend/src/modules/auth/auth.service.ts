import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

function generateApiKey() {
  // Simple high-entropy key for demo/local use; rotate in production.
  const rand = () => Math.random().toString(36).slice(2);
  return `rsm_${rand()}${rand()}${Date.now().toString(36)}`;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const company = await this.prisma.company.create({
      data: { name: dto.companyName, api_key: generateApiKey() },
    });

    const user = await this.prisma.user.create({
      data: { email: dto.email, password: passwordHash, company_id: company.id },
      select: { id: true, email: true, company_id: true, createdAt: true },
    });

    const token = await this.jwt.signAsync({
      sub: user.id,
      companyId: user.company_id,
    });

    return {
      user,
      company: { id: company.id, name: company.name, api_key: company.api_key },
      access_token: token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { company: true },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const token = await this.jwt.signAsync({
      sub: user.id,
      companyId: user.company_id,
    });

    return {
      user: { id: user.id, email: user.email, company_id: user.company_id },
      company: { id: user.company.id, name: user.company.name, api_key: user.company.api_key },
      access_token: token,
    };
  }
}

