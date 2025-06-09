import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiConsumes } from "@nestjs/swagger";
import { ethers } from "ethers";
import { AuthUserService } from "./authUser.service";
import { RegisterUserDto } from "./dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";


@Controller('/auth')
export class AuthUserController {

  constructor(private authUserService: AuthUserService) { }
  
  @Post('register')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiBody({
    description: 'Данные пользователя: адрес кошелька, имя, email, псевдоним, фото',
    examples: {
      example1: {
        value: {
          address: '0x123abc...',
          name: 'Иван Иванов',
          email: 'ivan@example.com',
          alias: 'ivan.eth',
          avatarUrl: 'https://example.com/avatar.jpg'
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован' })
  @ApiResponse({ status: 400, description: 'Некорректные или неполные данные' })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
  ]))
  async register(@Body() userData: RegisterUserDto, @UploadedFiles() files) {

    let avatar = null
    console.log(files)
    
    if(files.avatar) {
      avatar = files.avatar[0]
    }
    
    return this.authUserService.register(userData, avatar)
  }

  @Get('getAll')
  async getAll() {
    return this.authUserService.getAll()
  }

  @Post('deleteAll')
  async deleteAll() {
    return this.authUserService.deleteAll()
  }

  @Patch('changeUserData')
  @ApiOperation({ summary: 'Обновить данные пользователя' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
  ]))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Иван',
          description: 'Имя пользователя',
        },
        surname: {
          type: 'string',
          example: 'Петров',
          description: 'Фамилия пользователя',
        },
        email: {
          type: 'string',
          format: 'email',
          example: 'ivan.petrov@example.com',
          description: 'Электронная почта пользователя',
        },
        alias: {
          type: 'string',
          example: 'ivan.eteh',
          description: 'Псевдоним, отображаемый в системе',
        },
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Файл аватара пользователя (jpeg, png)',
        },
      },
      required: ['alias'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Пользователь обновлён',
  })
  async changeUserData(
    @Body() userData: RegisterUserDto,
    @UploadedFiles() files,
  ) {
    let avatar = null;

    if (files.avatar) {
      avatar = files.avatar[0];
    }

    return this.authUserService.changeUserData(userData, avatar);
  }

  @Get('getUserByAddress')
  @ApiOperation({ summary: 'Получение пользователя по адресу кошелька' })
  @ApiParam({ name: 'address', description: 'Публичный адрес пользователя', example: '0x123abc...' })
  @ApiResponse({
    status: 200,
    description: 'Информация о пользователе',
    schema: {
      example: {
        address: '0x123abc...',
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        alias: 'ivan.eth',
        avatarUrl: 'https://example.com/avatar.jpg'
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Пользователь с таким адресом не найден' })
  async getUserByAddress(@Query('address') address: string) {
    return this.authUserService.getByWalletAddress(address);
  }

  @Get('getUserByAlias/:alias')
  @ApiOperation({ summary: 'Получение адреса по псевдониму пользователя' })
  @ApiParam({ name: 'alias', description: 'Псевдоним пользователя', example: 'ivan.eth' })
  @ApiResponse({
    status: 200,
    description: 'Адрес, соответствующий псевдониму',
    schema: {
      example: {
        alias: 'ivan.eth',
        address: '0x123abc...',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Псевдоним не найден' })
  async getAddressByAlias(@Param('alias') alias: string) {
    return this.authUserService.getByAlias(alias);
  }

  @Get('nonce/:address')
  @ApiOperation({ summary: 'Получение nonce для подтверждения владения адресом' })
  @ApiResponse({
    status: 200,
    description: 'Случайный nonce для подписи',
    schema: {
      example: {
        nonce: 'Подпишите это сообщение чтобы войти на сайт\n0x123abc... время 1728204567821'
      }
    }
  })
  async getAuthMessage(@Param('address') address: string) {
    const nonce = `Подпишите это сообщение чтобы войти на сайт\nадрес:${address} время:${Date.now()}`;
    return nonce;
  }

  @Post('verify-signature')
  @ApiOperation({ summary: 'Проверка подписи и подтверждение владения адресом' })
  @ApiBody({
    schema: {
      example: {
        address: '0x123abc...',
        signature: '0xabc123...',
        message: 'Подпишите это сообщение чтобы войти на сайт\n0x123abc... время 1728204567821',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Подпись подтверждена' })
  @ApiResponse({ status: 400, description: 'Подпись не совпадает' })
  async verifySignature(@Body() {address, signature, message}: { address: string, signature: string, message: string }) {
    const response = await this.authUserService.verifySignature({address, signature, message})

    if(response.verified) {
      return response
    } else {
      throw new BadRequestException('Подпись не соответствует адресу'); 
    }
  }
}